/**
 * Builder Domain Store
 * @description 构建状态管理 - 管理技能位配置
 */

import { defineStore } from 'pinia';
import { computed, readonly, shallowRef } from 'vue';
import type {
	ActivatedSkillResult,
	SkillCardInfo,
	SkillCardInfoTuple,
	SlotAssignment,
} from './types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SectValue } from '../config/types.ts';
import type { DualStrategyInfo } from '../../core/data/types.ts';
import {
	calculateActivatedSkills,
	calculateSlotAssignments,
	checkDuplicateSect,
} from './service.ts';
import { getSkillIndex, getStrategyById } from '../skill/repository.ts';
import { getSkillNameBySectAndTrigger, isValidSect } from '../config/index.ts';

/**
 * 默认技能卡片配置
 */
const DEFAULT_SKILL_CARDS: SkillCardInfoTuple = [
	{ triggerName: '普攻', sect: '', skillName: '' },
	{ triggerName: '技能', sect: '', skillName: '' },
	{ triggerName: '冲刺', sect: '', skillName: '' },
	{ triggerName: '传承技', sect: '', skillName: '' },
	{ triggerName: '召唤', sect: '', skillName: '' },
];

/**
 * 有效的触发位列表
 */
const VALID_TRIGGERS: Trigger[] = [ '普攻', '技能', '冲刺', '传承技', '召唤' ];

/**
 * 构建状态 Store
 * @description 管理5个技能位的流派配置，使用 shallowRef 优化性能
 */
export const useBuilderStore = defineStore( 'builder', () => {
	// ==================== State ====================

	/**
	 * 技能卡片信息列表
	 * @description 使用 shallowRef 替代 reactive，避免深层响应式代理开销
	 */
	const skillCardInfoList = shallowRef<SkillCardInfoTuple>( structuredClone( DEFAULT_SKILL_CARDS ) );

	// ==================== Getters ====================

	/**
	 * 只读卡片列表
	 * @description 提供只读访问，防止外部直接修改
	 */
	const readOnlyCardList = computed( () => readonly( skillCardInfoList.value ) );

	/**
	 * 自然激活的策略
	 * @description 基于新算法 + V2 索引的唯一计算入口，其余动作复用其结果（Q6-b）
	 */
	const calculatedSkills = computed<DualStrategyInfo[]>( () => {
		const index = getSkillIndex().value;
		if ( !index ) return [];
		return calculateActivatedSkills( skillCardInfoList.value, index );
	} );

	/**
	 * 槽位分配：每触发位占据的双重策略 + 锁定状态
	 * @description 派生结果（不可手动修改），由手动 pin + 自动解析共同决定
	 */
	const slotAssignments = computed<Map<Trigger, SlotAssignment>>( () => {
		return calculateSlotAssignments( skillCardInfoList.value, calculatedSkills.value );
	} );

	/**
	 * 已激活的策略 = 自然激活 ∪ 手动 pin（按 id 去重）
	 */
	const activatedSkills = computed<ActivatedSkillResult>( () => {
		const skills = calculatedSkills.value;

		// 手动 pin 的策略（按 id 反查完整策略）
		const pinnedSkills = skillCardInfoList.value
			.filter( ( card ) => card.manualSkillId )
			.map( ( card ) => getStrategyById( card.manualSkillId! ) )
			.filter( ( s ): s is DualStrategyInfo => !!s );

		const calculatedIds = new Set( skills.map( ( s ) => s.id ) );
		const uniquePinned = pinnedSkills.filter( ( s ) => !calculatedIds.has( s.id ) );
		const allSkills = [ ...skills, ...uniquePinned ];

		return {
			skills: allSkills,
			count: allSkills.length,
			skillNames: allSkills.map( ( skill ) => skill.name ),
		};
	} );

	/**
	 * 已配置的流派数量
	 */
	const configuredCount = computed( () => {
		return skillCardInfoList.value.filter( ( card ) => card.sect ).length;
	} );

	/**
	 * 是否有配置
	 */
	const hasConfiguration = computed( () => {
		return configuredCount.value > 0;
	} );

	// ==================== Actions ====================

	/**
	 * 更新卡片流派信息
	 * @param triggerName - 触发位名称
	 * @param sect - 流派名称
	 */
	const updateSkillCardInfo = ( triggerName: Trigger, sect: SectValue | '' ): boolean => {
		// 防御性编程：验证 triggerName 有效性
		if ( !VALID_TRIGGERS.includes( triggerName ) ) {
			console.warn( `[useBuilderStore] 无效的触发位: ${ triggerName }` );
			return false;
		}

		// 防御性编程：验证 sect 有效性（允许空字符串）
		if ( sect && !isValidSect( sect ) ) {
			console.warn( `[useBuilderStore] 无效的流派: ${ sect }` );
			return false;
		}

		// 创建新数组以触发 shallowRef 更新，并一并写入该触发位下该流派的技能名
		const newList = skillCardInfoList.value.map( ( item ) =>
			item.triggerName === triggerName
				? { ...item, sect, skillName: getSkillNameBySectAndTrigger( sect, triggerName ) }
				: item,
		) as SkillCardInfoTuple;

		skillCardInfoList.value = newList;
		return true;
	};

	/**
	 * 手动选择双重策略到指定触发位（手动 pin）
	 * @description 粘性：不受流派配置变化影响，仅用户可增删
	 * @param triggerName - 触发位名称
	 * @param skillId - 双重策略 id
	 */
	const setManualSkill = ( triggerName: Trigger, skillId: string ): boolean => {
		if ( !VALID_TRIGGERS.includes( triggerName ) ) {
			console.warn( `[useBuilderStore] 无效的触发位: ${ triggerName }` );
			return false;
		}

		const newList = skillCardInfoList.value.map( ( item ) =>
			item.triggerName === triggerName
				? { ...item, manualSkillId: skillId }
				: item,
		) as SkillCardInfoTuple;

		skillCardInfoList.value = newList;
		return true;
	};

	/**
	 * 删除指定触发位的手动 pin
	 * @param triggerName - 触发位名称
	 */
	const clearManualSkill = ( triggerName: Trigger ): boolean => {
		if ( !VALID_TRIGGERS.includes( triggerName ) ) {
			console.warn( `[useBuilderStore] 无效的触发位: ${ triggerName }` );
			return false;
		}

		const newList = skillCardInfoList.value.map( ( item ) =>
			item.triggerName === triggerName
				? { ...item, manualSkillId: undefined }
				: item,
		) as SkillCardInfoTuple;

		skillCardInfoList.value = newList;
		return true;
	};

	/**
	 * 获取指定触发位的卡片信息
	 * @param triggerName - 触发位名称
	 */
	const getSkillCardByTrigger = ( triggerName: Trigger ): SkillCardInfo | undefined => {
		return skillCardInfoList.value.find( ( item ) => item.triggerName === triggerName );
	};

	/**
	 * 检查流派是否重复配置
	 * @param sect - 要检查的流派
	 * @param excludeTrigger - 排除的触发位（用于编辑时排除自身）
	 */
	const checkSectDuplicate = ( sect: SectValue, excludeTrigger?: Trigger ) => {
		return checkDuplicateSect( skillCardInfoList.value, sect, excludeTrigger );
	};

	/**
	 * 重置所有卡片信息
	 */
	const resetAllSkillCards = (): void => {
		skillCardInfoList.value = structuredClone( DEFAULT_SKILL_CARDS );
	};

	/**
	 * 导出当前配置
	 * @description 用于本地存储
	 */
	const exportConfiguration = (): SkillCardInfoTuple => {
		return structuredClone( skillCardInfoList.value );
	};

	/**
	 * 导入配置
	 * @description 从本地存储恢复；仅保留新模型字段，剥离旧版 inherit/inheritSkill
	 */
	const importConfiguration = ( config: SkillCardInfoTuple ): boolean => {
		// 简单验证
		if ( !Array.isArray( config ) || config.length !== 5 ) {
			console.warn( '[useBuilderStore] 导入配置失败：格式无效' );
			return false;
		}

		const normalized = config.map( ( card ) => {
			// 回填缺失的技能名（防御旧数据：sect 非空但无 skillName）
			const skillName =
				typeof card.skillName === 'string'
					? card.skillName
					: getSkillNameBySectAndTrigger( card.sect, card.triggerName );
			return {
				triggerName: card.triggerName,
				sect: card.sect,
				skillName,
				manualSkillId: ( card as { manualSkillId?: string } ).manualSkillId,
			};
		} ) as SkillCardInfoTuple;

		skillCardInfoList.value = normalized;
		return true;
	};

	return {
		// State
		skillCardInfoList,

		// Getters
		readOnlyCardList,
		activatedSkills,
		slotAssignments,
		configuredCount,
		hasConfiguration,
		calculatedSkills,

		// Actions
		updateSkillCardInfo,
		setManualSkill,
		clearManualSkill,
		getSkillCardByTrigger,
		checkSectDuplicate,
		resetAllSkillCards,
		exportConfiguration,
		importConfiguration,
	};
} );
