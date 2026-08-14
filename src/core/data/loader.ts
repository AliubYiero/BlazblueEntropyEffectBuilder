// src/core/data/loader.ts
/**
 * 数据加载器
 * @description 负责加载 V2 策略数据、构建并冻结索引
 */

import type {
	DataLoadResult,
	DualStrategyIndex,
	DualStrategyInfo,
	FrozenDualStrategyIndex,
} from './types.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SectValue } from '../../domains/config/types.ts';

/**
 * V2 数据文件原始形状
 */
interface V2DualStrategyRaw {
	id: string;
	name: string;
	element: Attribute;
	triggerSlots: string[];
	primary: Array<{ slot: string; style: string; name: string }>;
	secondary: Array<{ slot: string; style: string; name: string }>;
	description: string;
}

interface V2SkillData {
	version: string;
	slots: Record<string, string[]>;
	styleAliases: Record<string, string[]>;
	dualStrategies: V2DualStrategyRaw[];
}

/**
 * 数据加载状态
 */
let cachedData: FrozenDualStrategyIndex | null = null;

/**
 * 深度冻结对象
 * @description 递归冻结数组、对象与 Map 中包含的条目
 */
function deepFreeze<T>( obj: T ): Readonly<T> {
	if ( obj === null || typeof obj !== 'object' ) {
		return obj as Readonly<T>;
	}

	if ( obj instanceof Map ) {
		for ( const [ key, value ] of obj ) {
			deepFreeze( key );
			deepFreeze( value );
		}
	}
	else if ( Array.isArray( obj ) ) {
		for ( const item of obj ) {
			deepFreeze( item );
		}
	}
	else {
		for ( const key of Object.keys( obj ) ) {
			const value = ( obj as Record<string, unknown> )[ key ];
			if ( value && typeof value === 'object' && !Object.isFrozen( value ) ) {
				deepFreeze( value );
			}
		}
	}

	Object.freeze( obj );
	return obj as Readonly<T>;
}

/**
 * 构建双重策略索引
 * @param raw - V2 原始数据
 */
function buildDualStrategyIndex( raw: V2SkillData ): DualStrategyIndex {
	// 别名展开：变体 style -> canonical style
	const canonicalStyle = new Map<SectValue, SectValue>();
	for ( const [ canonical, variants ] of Object.entries( raw.styleAliases ) ) {
		for ( const variant of variants ) {
			canonicalStyle.set( variant, canonical );
		}
	}

	// 策略列表
	const strategies: DualStrategyInfo[] = raw.dualStrategies.map( ( d ) => ( {
		id: d.id,
		name: d.name,
		element: d.element,
		triggerSlots: d.triggerSlots as Trigger[],
		primary: d.primary.map( ( c ) => ( {
			slot: c.slot as Trigger,
			style: c.style,
			name: c.name,
		} ) ),
		secondary: d.secondary.map( ( c ) => ( {
			slot: c.slot as Trigger,
			style: c.style,
			name: c.name,
		} ) ),
		description: d.description,
	} ) );

	// (slot, style) 规范化后倒排：槽位+流派 -> 策略 id 列表
	const bySlotStyle = new Map<string, string[]>();
	const addSlotStyle = ( slot: Trigger, style: SectValue, id: string ): void => {
		const key = `${ slot }:${ canonicalStyle.get( style ) ?? style }`;
		const list = bySlotStyle.get( key );
		if ( list ) {
			list.push( id );
		}
		else {
			bySlotStyle.set( key, [ id ] );
		}
	};
	for ( const strategy of strategies ) {
		for ( const cond of strategy.primary ) {
			addSlotStyle( cond.slot, cond.style, strategy.id );
		}
		for ( const cond of strategy.secondary ) {
			addSlotStyle( cond.slot, cond.style, strategy.id );
		}
	}

	// 触发位 -> 可用流派列表（直接来自 V2 slots）
	const stylesBySlot = new Map<Trigger, readonly SectValue[]>();
	for ( const [ slot, styles ] of Object.entries( raw.slots ) ) {
		stylesBySlot.set( slot as Trigger, styles );
	}

	return { strategies, bySlotStyle, canonicalStyle, stylesBySlot };
}

/**
 * 加载技能数据
 */
export async function loadSkillData(): Promise<DataLoadResult<FrozenDualStrategyIndex>> {
	// 返回缓存数据
	if ( cachedData !== null ) {
		return { success: true, data: cachedData };
	}

	try {
		const module = await import( '../../data/DoubleSkillInfoListV2.json' );
		const raw = module.default as V2SkillData;

		if ( raw.version !== '2.0' ) {
			throw new Error( `V2 数据版本校验失败: 期望 "2.0"，实际 "${ raw.version }"` );
		}

		const index = buildDualStrategyIndex( raw );
		cachedData = deepFreeze( index ) as FrozenDualStrategyIndex;

		console.log( '[core/data/loader] V2 数据加载成功' );
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
export function getCachedSkillData(): FrozenDualStrategyIndex | null {
	return cachedData;
}

/**
 * 重置缓存（用于测试）
 */
export function resetCache(): void {
	cachedData = null;
}
