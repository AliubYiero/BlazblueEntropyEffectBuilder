/**
 * useSkillData.ts
 * @file 技能数据管理 Composable - 优化版
 * @description 使用 shallowRef 和 Object.freeze 优化性能，动态加载 JSON 数据
 * @author Yiero
 * */

import { shallowRef, computed, readonly, type Ref } from 'vue';
import type { SkillInfoInterface } from '../interfaces/SkillInfoInterface.ts';
import type { SectValue } from '../interfaces/SectValue.ts';
import type { Trigger } from '../interfaces/Trigger.ts';
import { sectConfig, sectList, getSkillsBySect } from '../config/sectConfig.ts';
import type { Attribute } from '../config/sectConfig.ts';

/**
 * 触发位信息接口
 * */
interface TriggerInfo {
	name: SectValue;
	trigger: Trigger[];
}

// 模块级状态，确保单例
let isInitialized = false;
const rawSkillData = shallowRef<Readonly<SkillInfoInterface[]>>([]);

/**
 * 技能数据管理 Composable
 * @description 提供冻结的技能数据和派生计算属性
 * */
export const useSkillData = () => {
	// 延迟初始化
	if ( !isInitialized ) {
		initializeData();
	}

	// 只读的数据引用
	const skillInfoList = readonly( rawSkillData ) as Readonly<Ref<Readonly<SkillInfoInterface[]>>>;

	/**
	 * 流派到属性的映射表（计算属性缓存）
	 * */
	const sectMapper = computed( () => {
		const mapper = new Map<SectValue, Attribute>();
		Object.entries( sectConfig ).forEach( ( [ attribute, sects ] ) => {
			sects.forEach( ( sect ) => {
				mapper.set( sect as SectValue, attribute as Attribute );
			} );
		} );
		return mapper;
	} );

	/**
	 * 流派可用的触发位列表（从数据中派生）
	 * */
	const triggerInfoList = computed<Readonly<TriggerInfo[]>>( () => {
		const sectTriggers = new Map<SectValue, Set<Trigger>>();

		rawSkillData.value.forEach( ( skill ) => {
			// 为主流派和副流派都添加触发位
			[ skill.mainSect, skill.secondSect ].forEach( ( sect ) => {
				if ( !sectTriggers.has( sect ) ) {
					sectTriggers.set( sect, new Set() );
				}
				skill.trigger.forEach( ( t ) => sectTriggers.get( sect )?.add( t ) );
			} );
		} );

		return Object.freeze(
			Array.from( sectTriggers.entries() ).map( ( [ name, triggers ] ) => ( {
				name,
				trigger: Array.from( triggers ),
			} ) ),
		);
	} );

	/**
	 * 根据流派获取属性
	 * */
	const getAttributeBySect = ( sect: SectValue ): Attribute | undefined => {
		return sectMapper.value.get( sect );
	};

	/**
	 * 获取流派支持的触发位
	 * */
	const getValidTriggersForSect = ( sect: SectValue ): Trigger[] => {
		const info = triggerInfoList.value.find( ( t ) => t.name === sect );
		return info ? info.trigger : [];
	};

	/**
	 * 检查流派是否有效
	 * */
	const isValidSect = ( sect: SectValue ): boolean => {
		return sectMapper.value.has( sect );
	};

	return {
		skillInfoList,
		triggerInfoList,
		sectMapper,
		getAttributeBySect,
		getValidTriggersForSect,
		isValidSect,
		getSkillsBySect,
		sectList,
	};
};

/**
 * 初始化数据 - 动态导入 JSON 并冻结
 * */
const initializeData = async () => {
	try {
		const data = await import( '../data/SkillInfoList.json' );
		// 冻结数据，避免 Vue 深度响应式代理
		const frozenData = Object.freeze( [ ...data.default ] ) as Readonly<SkillInfoInterface[]>;
		rawSkillData.value = frozenData;
		isInitialized = true;
	} catch ( error ) {
		console.error( '[useSkillData] 数据加载失败:', error );
		rawSkillData.value = Object.freeze( [] ) as Readonly<SkillInfoInterface[]>;
		isInitialized = true;
	}
};
