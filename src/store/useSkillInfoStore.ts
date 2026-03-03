/**
 * useSkillInfoStore.ts
 * created by 2024/4/11
 * @file 技能信息列表
 * @description 管理技能数据的筛选和查询，数据从 useSkillData 获取
 * @author Yiero
 * */

import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useSkillData } from '../composables/useSkillData.ts';
import type { Attribute } from '../interfaces/Attribute.ts';
import type { SectValue } from '../interfaces/SectValue.ts';
import type { Trigger } from '../interfaces/Trigger.ts';

/**
 * 技能信息储存
 * @description 提供技能数据的筛选和查询功能，数据来自 useSkillData
 * */
export const useSkillInfoStore = defineStore( 'skillInfo', () => {
	const skillData = useSkillData();

	// 直接暴露 useSkillData 的数据和方法
	const skillInfoList = skillData.skillInfoList;
	const triggerInfoList = skillData.triggerInfoList;
	const sectMapper = skillData.sectMapper;

	/**
	 * 根据属性筛选技能（计算属性缓存）
	 * @param attribute - 属性名称
	 * @returns 匹配的技能列表
	 * */
	const filterSkillsByAttribute = ( attribute: Attribute ) => {
		return computed( () =>
			skillInfoList.value.filter(
				( skill ) =>
					skill.mainAttribute === attribute || skill.secondAttribute === attribute,
			),
		);
	};

	/**
	 * 根据流派筛选技能（计算属性缓存）
	 * @param sect - 流派名称
	 * @returns 匹配的技能列表
	 * */
	const filterSkillsBySect = ( sect: SectValue ) => {
		return computed( () =>
			skillInfoList.value.filter(
				( skill ) => skill.mainSect === sect || skill.secondSect === sect,
			),
		);
	};

	/**
	 * 根据触发位筛选技能（计算属性缓存）
	 * @param trigger - 触发位名称
	 * @returns 匹配的技能列表
	 * */
	const filterSkillsByTrigger = ( trigger: Trigger ) => {
		return computed( () =>
			skillInfoList.value.filter( ( skill ) => skill.trigger.includes( trigger ) ),
		);
	};

	/**
	 * 根据多个条件筛选技能
	 * @param filters - 筛选条件
	 * @returns 匹配的技能列表
	 * */
	const filterSkills = ( filters: {
		attribute?: Attribute;
		sect?: SectValue;
		trigger?: Trigger;
	} ) => {
		return computed( () => {
			return skillInfoList.value.filter( ( skill ) => {
				if ( filters.attribute ) {
					const matchesAttribute =
						skill.mainAttribute === filters.attribute ||
						skill.secondAttribute === filters.attribute;
					if ( !matchesAttribute ) return false;
				}

				if ( filters.sect ) {
					const matchesSect =
						skill.mainSect === filters.sect || skill.secondSect === filters.sect;
					if ( !matchesSect ) return false;
				}

				if ( filters.trigger ) {
					const matchesTrigger = skill.trigger.includes( filters.trigger );
					if ( !matchesTrigger ) return false;
				}

				return true;
			} );
		} );
	};

	return {
		skillInfoList,
		triggerInfoList,
		sectMapper,
		filterSkillsByAttribute,
		filterSkillsBySect,
		filterSkillsByTrigger,
		filterSkills,
	};
} );