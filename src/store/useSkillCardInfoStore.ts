/**
 * useSkillCardInfoStore.ts
 * created by 2024/4/20
 * @file 技能构建页, 技能卡片信息卡片列表
 * @description 使用 shallowRef 优化性能，管理流派配置状态
 * @author Yiero
 * */

import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import type { SkillCardInfoTuple } from '../interfaces/SkillCardInfoTuple.ts';
import type { Trigger } from '../interfaces/Trigger.ts';
import type { SectValue } from '../interfaces/SectValue.ts';
import { useSkillData } from '../composables/useSkillData.ts';

/**
 * 技能卡片信息 Store
 * @description 管理5个技能位的流派配置，使用 shallowRef 优化性能
 * */
export const useSkillCardInfoStore = defineStore( 'skillCardInfo', () => {
	const skillData = useSkillData();

	/**
	 * 技能卡片信息列表
	 * @description 使用 shallowRef 替代 reactive，避免深层响应式代理开销
	 * */
	const skillCardInfoList = shallowRef<SkillCardInfoTuple>( [
		{ triggerName: '普攻', sect: '', inherit: false },
		{ triggerName: '技能', sect: '', inherit: false },
		{ triggerName: '冲刺', sect: '', inherit: false },
		{ triggerName: '传承', sect: '', inherit: false },
		{ triggerName: '召唤', sect: '', inherit: false },
	] );

	/**
	 * 更新卡片继承状态信息
	 * @param triggerName - 触发位名称
	 * @param inherit - 是否继承
	 * */
	const updateSkillCardInfoInherit = (
		triggerName: Trigger,
		inherit: boolean,
	) => {
		// 创建新数组以触发 shallowRef 更新
		const newList: SkillCardInfoTuple = skillCardInfoList.value.map( ( item ) =>
			item.triggerName === triggerName ? { ...item, inherit } : item,
		) as SkillCardInfoTuple;
		skillCardInfoList.value = newList;
	};

	/**
	 * 更新卡片的信息
	 * @param triggerName - 触发位名称
	 * @param sect - 流派名称
	 * */
	const updateSkillCardInfo = ( triggerName: Trigger, sect: SectValue | '' ) => {
		// 防御性编程：验证 triggerName 有效性
		const validTriggers: Trigger[] = [ '普攻', '技能', '冲刺', '传承', '召唤' ];
		if ( !validTriggers.includes( triggerName ) ) {
			console.warn( `[useSkillCardInfoStore] 无效的触发位: ${ triggerName }` );
			return;
		}

		// 防御性编程：验证 sect 有效性（允许空字符串）
		if ( sect && !skillData.isValidSect( sect ) ) {
			console.warn( `[useSkillCardInfoStore] 无效的流派: ${ sect }` );
			return;
		}

		// 创建新数组以触发 shallowRef 更新
		const newList: SkillCardInfoTuple = skillCardInfoList.value.map( ( item ) =>
			item.triggerName === triggerName ? { ...item, sect } : item,
		) as SkillCardInfoTuple;
		skillCardInfoList.value = newList;
	};

	/**
	 * 重置所有卡片信息
	 * */
	const resetAllSkillCards = () => {
		skillCardInfoList.value = [
			{ triggerName: '普攻', sect: '', inherit: false },
			{ triggerName: '技能', sect: '', inherit: false },
			{ triggerName: '冲刺', sect: '', inherit: false },
			{ triggerName: '传承', sect: '', inherit: false },
			{ triggerName: '召唤', sect: '', inherit: false },
		];
	};

	/**
	 * 获取指定触发位的卡片信息
	 * @param triggerName - 触发位名称
	 * */
	const getSkillCardByTrigger = ( triggerName: Trigger ) => {
		return skillCardInfoList.value.find( ( item ) => item.triggerName === triggerName );
	};

	return {
		skillCardInfoList,
		updateSkillCardInfoInherit,
		updateSkillCardInfo,
		resetAllSkillCards,
		getSkillCardByTrigger,
	};
} );