// src/core/data/loader.ts
/**
 * 数据加载器
 * @description 负责加载和冻结 JSON 数据
 */

import type {
  DataLoadResult,
  FrozenSkillInfoList,
  SkillInfo,
} from './types.ts';

/**
 * 数据加载状态
 */
let cachedData: FrozenSkillInfoList | null = null;

/**
 * 深度冻结对象
 */
function deepFreeze<T>( obj: T ): Readonly<T> {
	if ( obj === null || typeof obj !== 'object' ) {
		return obj as Readonly<T>;
	}
	
	Object.freeze( obj );
	
	for ( const key of Object.keys( obj ) ) {
		const value = ( obj as Record<string, unknown> )[ key ];
		if ( value && typeof value === 'object' && !Object.isFrozen( value ) ) {
			deepFreeze( value );
		}
	}
	
	return obj as Readonly<T>;
}

/**
 * 加载技能数据
 */
export async function loadSkillData(): Promise<DataLoadResult<FrozenSkillInfoList>> {
	// 返回缓存数据
	if ( cachedData !== null ) {
		return { success: true, data: cachedData };
	}
	
	try {
		const module = await import('../../data/DoubleSkillInfoList.json');
		const data = module.default as SkillInfo[];
		cachedData = deepFreeze( [ ...data ] ) as FrozenSkillInfoList;
		
		console.log( '[core/data/loader] 数据加载成功' );
		return { success: true, data: cachedData };
	}
	catch ( error ) {
		const err = error instanceof Error ? error : new Error( String( error ) );
		console.error( '[core/data/loader] 数据加载失败:', err );
		return { success: false, error: err };
	}
}

/**
 * 获取缓存的数据（同步）
 */
export function getCachedSkillData(): FrozenSkillInfoList | null {
	return cachedData;
}

/**
 * 重置缓存（用于测试）
 */
export function resetCache(): void {
	cachedData = null;
}
