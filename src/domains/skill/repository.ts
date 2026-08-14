/**
 * Skill Domain Repository
 * @description 技能数据仓库 - 管理 V2 索引的加载、缓存和查询
 */

import { shallowRef, type Ref } from 'vue';
import type { FrozenDualStrategyIndex, DualStrategyInfo } from '../../core/data/types.ts';
import { getCachedSkillData, loadSkillData } from '../../core/data/loader.ts';
import { getAttributeBySect } from '../config/utils.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../config/types.ts';

/**
 * 数据仓库状态
 */
let isInitialized = false;
const rawIndex = shallowRef<FrozenDualStrategyIndex | null>( null );

/**
 * 派生策略的显示流派与属性（Q10）
 * @description 主侧流派属性为 element；副侧属性从副侧流派经 sectList 派生
 * （V2 element 仅等于主侧属性，混合属性策略的副侧属性需单独反查）
 */
export function getStrategySectPair( strategy: DualStrategyInfo ): {
	primaryStyle: SectValue;
	primaryAttribute: Attribute;
	secondaryStyle: SectValue;
	secondaryAttribute: Attribute;
} {
	const primaryStyle = strategy.primary[ 0 ]?.style ?? '';
	const secondaryStyle = strategy.secondary[ 0 ]?.style ?? '';

	return {
		primaryStyle,
		primaryAttribute: strategy.element,
		secondaryStyle,
		secondaryAttribute: getAttributeBySect( secondaryStyle ) ?? strategy.element,
	};
}

/**
 * 初始化数据仓库
 * @description 加载 V2 索引并缓存
 */
export async function initializeRepository(): Promise<boolean> {
	if ( isInitialized && rawIndex.value !== null ) {
		return true;
	}

	// 先检查缓存
	const cachedData = getCachedSkillData();
	if ( cachedData ) {
		rawIndex.value = cachedData;
		isInitialized = true;
		console.log( '[domains/skill/repository] 从缓存加载成功' );
		return true;
	}

	// 加载数据
	const result = await loadSkillData();
	if ( result.success ) {
		rawIndex.value = result.data;
		isInitialized = true;
		console.log( '[domains/skill/repository] 数据加载成功' );
		return true;
	}
	else {
		console.error( '[domains/skill/repository] 数据加载失败:', result.error );
		return false;
	}
}

/**
 * 获取 V2 索引（响应式）
 * @description 构建域激活算法与筛选的数据源；数据在应用启动时加载且不可变
 */
export function getSkillIndex(): Ref<FrozenDualStrategyIndex | null> {
	return rawIndex;
}

/**
 * 根据策略 id 反查完整策略
 * @param id - 策略 id
 * @returns 完整策略信息，未找到则返回 undefined
 */
export function getStrategyById( id: string ): DualStrategyInfo | undefined {
	return rawIndex.value?.strategies.find( ( s ) => s.id === id );
}

/**
 * 重置仓库状态（用于测试）
 */
export function resetRepository(): void {
	isInitialized = false;
	rawIndex.value = null;
}
