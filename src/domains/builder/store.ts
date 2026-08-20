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
} from './types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SectValue } from '../config/types.ts';
import type { DualStrategyInfo } from '../../core/data/types.ts';
import { calculateActivatedSkills, checkDuplicateSect } from './service.ts';
import { getSkillIndex, getStrategyById } from '../skill/repository.ts';
import { getSkillNameBySectAndTrigger, isValidSect } from '../config/index.ts';

/**
 * 默认技能卡片配置
 */
const DEFAULT_SKILL_CARDS: SkillCardInfoTuple = [
	{ triggerName: '普攻', sect: '', skillName: '', inherit: false },
	{ triggerName: '技能', sect: '', skillName: '', inherit: false },
	{ triggerName: '冲刺', sect: '', skillName: '', inherit: false },
	{ triggerName: '传承技', sect: '', skillName: '', inherit: false },
	{ triggerName: '召唤', sect: '', skillName: '', inherit: false },
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
	 * 自然激活的策略（不含继承）
	 * @description 基于新算法 + V2 索引的唯一计算入口，其余动作复用其结果（Q6-b）
	 */
	const calculatedSkills = computed<DualStrategyInfo[]>( () => {
		const index = getSkillIndex().value;
		if ( !index ) return [];
		return calculateActivatedSkills( skillCardInfoList.value, index );
	} );

	/**
	 * 已激活的策略（V2 新形状）
	 */
	const activatedSkills = computed<ActivatedSkillResult>( () => {
		const skills = calculatedSkills.value;

		// 合并继承的双重策略（按 id 反查完整策略，id 去重）
		const inheritedSkills = skillCardInfoList.value
			.filter( ( card ) => card.inherit && card.inheritSkill )
			.map( ( card ) => card.inheritSkill! )
			.map( ( id ) => getStrategyById( id ) )
			.filter( ( s ): s is DualStrategyInfo => !!s );

		const calculatedIds = new Set( skills.map( ( s ) => s.id ) );
		const uniqueInherited = inheritedSkills.filter( ( s ) => !calculatedIds.has( s.id ) );
		const allSkills = [ ...skills, ...uniqueInherited ];

		const allSkillNames = allSkills.map( ( skill ) => skill.name );

		return {
			skills: allSkills,
			count: allSkills.length,
			skillNames: allSkillNames,
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

		// 单次计算：自然激活集合仅计算一次，其余动作复用其结果（Q6-b）
		const index = getSkillIndex().value;
		const calculated = index ? calculateActivatedSkills( newList, index ) : [];
		// 先清除不再有效的继承，再自动继承单触发位的双重策略
		clearInvalidInheritedSkills( calculated );
		autoInheritSingleTriggerSkills( calculated );
		return true;
	};

	/**
	 * 更新卡片继承状态
	 * @param triggerName - 触发位名称
	 * @param inherit - 是否继承
	 */
	const updateSkillCardInherit = ( triggerName: Trigger, inherit: boolean ): boolean => {
		// 防御性编程：验证 triggerName 有效性
		if ( !VALID_TRIGGERS.includes( triggerName ) ) {
			console.warn( `[useBuilderStore] 无效的触发位: ${ triggerName }` );
			return false;
		}

		// 创建新数组以触发 shallowRef 更新
		const newList = skillCardInfoList.value.map( ( item ) =>
			item.triggerName === triggerName ? { ...item, inherit } : item,
		) as SkillCardInfoTuple;

		skillCardInfoList.value = newList;
		return true;
	};

	/**
	 * 设置继承的双重策略
	 * @param triggerName - 触发位名称
	 * @param skillId - 要继承的双重策略 id（Q7）
	 */
	const setInheritSkill = ( triggerName: Trigger, skillId: string ): boolean => {
		if ( !VALID_TRIGGERS.includes( triggerName ) ) {
			console.warn( `[useBuilderStore] 无效的触发位: ${ triggerName }` );
			return false;
		}

		const newList = skillCardInfoList.value.map( ( item ) =>
			item.triggerName === triggerName
				? { ...item, inherit: true, inheritSkill: skillId }
				: item,
		) as SkillCardInfoTuple;

		skillCardInfoList.value = newList;
		return true;
	};

	/**
	 * 清除继承的双重策略
	 * @param triggerName - 触发位名称
	 */
	const clearInheritSkill = ( triggerName: Trigger ): boolean => {
		if ( !VALID_TRIGGERS.includes( triggerName ) ) {
			console.warn( `[useBuilderStore] 无效的触发位: ${ triggerName }` );
			return false;
		}

		const newList = skillCardInfoList.value.map( ( item ) =>
			item.triggerName === triggerName
				? { ...item, inherit: false, inheritSkill: undefined }
				: item,
		) as SkillCardInfoTuple;

		skillCardInfoList.value = newList;
		return true;
	};

	/**
	 * 清除不再有效的继承
	 * @description 当流派配置变化时，清除 inheritSkill 对应策略已不在激活列表中的继承
	 * @param calculated - 预计算的自然激活集合（复用单次计算结果）
	 */
	const clearInvalidInheritedSkills = ( calculated?: DualStrategyInfo[] ): void => {
		const activatedIds = new Set( ( calculated ?? calculatedSkills.value ).map( ( s ) => s.id ) );
		let changed = false;
		let current = skillCardInfoList.value;

		for ( const card of current ) {
			if ( card.inherit && card.inheritSkill && !activatedIds.has( card.inheritSkill ) ) {
				current = current.map( ( item ) =>
					item.triggerName === card.triggerName
						? { ...item, inherit: false, inheritSkill: undefined }
						: item,
				) as SkillCardInfoTuple;
				changed = true;
			}
		}

		if ( changed ) {
			skillCardInfoList.value = current;
		}
	};

	/**
	 * 自动设置单触发位和最后剩余触发位的继承
	 * @description 当激活策略变化时调用，自动勾选确定性的触发位
	 * @param calculated - 预计算的自然激活集合（复用单次计算结果）
	 */
	const autoInheritSingleTriggerSkills = ( calculated?: DualStrategyInfo[] ): void => {
		const activated = calculated ?? calculatedSkills.value;
		let changed = false;
		let current = skillCardInfoList.value;

		for ( const skill of activated ) {
			if ( skill.triggerSlots.length === 1 ) {
				const trigger = skill.triggerSlots[ 0 ];
				const card = current.find( ( c ) => c.triggerName === trigger );
				if ( card && !card.inherit ) {
					current = current.map( ( item ) =>
						item.triggerName === trigger
							? { ...item, inherit: true, inheritSkill: skill.id }
							: item,
					) as SkillCardInfoTuple;
					changed = true;
				}
			}
		}

		if ( changed ) {
			skillCardInfoList.value = current;
		}
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
	 * @description 从本地存储恢复
	 */
	const importConfiguration = ( config: SkillCardInfoTuple ): boolean => {
		// 简单验证
		if ( !Array.isArray( config ) || config.length !== 5 ) {
			console.warn( '[useBuilderStore] 导入配置失败：格式无效' );
			return false;
		}

		// 回填缺失的技能名（防御旧数据：sect 非空但无 skillName）
		const normalized = config.map( ( card ) => {
			const skillName =
				typeof card.skillName === 'string'
					? card.skillName
					: getSkillNameBySectAndTrigger( card.sect, card.triggerName );
			return { ...card, skillName };
		} ) as SkillCardInfoTuple;

		skillCardInfoList.value = normalized;
		return true;
	};

	/**
	 * 获取触发位的勾选框三态状态
	 * @description 基于自然激活策略计算，继承的策略不影响其他触发位
	 * @param trigger - 触发位名称
	 * @returns 'checked' | 'pending' | 'unchecked'
	 */
	const getCheckboxState = ( trigger: Trigger ): 'checked' | 'pending' | 'unchecked' => {
		const card = skillCardInfoList.value.find( ( c ) => c.triggerName === trigger );
		if ( card?.inherit ) return 'checked';

		const related = calculatedSkills.value.filter( ( s ) => s.triggerSlots.includes( trigger ) );
		if ( related.length === 0 ) return 'unchecked';

		for ( const skill of related ) {
			if ( skill.triggerSlots.length === 1 ) return 'checked';

			const otherTriggers = skill.triggerSlots.filter( ( t ) => t !== trigger );
			const allOthersChecked = otherTriggers.every( ( t ) => {
				const otherCard = skillCardInfoList.value.find( ( c ) => c.triggerName === t );
				return otherCard?.inherit;
			} );
			if ( allOthersChecked ) return 'checked';
		}

		return 'pending';
	};

	return {
		// State
		skillCardInfoList,

		// Getters
		readOnlyCardList,
		activatedSkills,
		configuredCount,
		hasConfiguration,
		calculatedSkills,

		// Actions
		updateSkillCardInfo,
		updateSkillCardInherit,
		setInheritSkill,
		clearInheritSkill,
		clearInvalidInheritedSkills,
		autoInheritSingleTriggerSkills,
		getSkillCardByTrigger,
		checkSectDuplicate,
		resetAllSkillCards,
		exportConfiguration,
		importConfiguration,
		getCheckboxState,
	};
} );
