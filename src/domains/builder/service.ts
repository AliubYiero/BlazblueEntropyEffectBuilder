/**
 * Builder Domain Service
 * @description 构建逻辑服务 - 纯函数计算激活策略
 */

import type {
	DuplicateCheckResult,
	SkillCardInfo,
	SkillCardInfoTuple,
} from './types.ts';
import type { SectValue } from '../config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type {
	DualStrategyCondition,
	DualStrategyInfo,
	FrozenDualStrategyIndex,
} from '../../core/data/types.ts';
import { getSkillIndex } from '../skill/repository.ts';

/**
 * 计算已激活的策略（Q4 统一规则）
 * @description 策略激活 ⟺ primary 某个候选 (slot, style) 命中一张已配置卡片 ∧
 * secondary 某个候选命中 ∧（命中的 primary 槽位 ∈ triggerSlots ∨ 命中的 secondary 槽位 ∈ triggerSlots）
 * @param cards - 技能位配置元组
 * @param index - V2 只读索引
 * @returns 激活的策略列表（新形状）
 */
export function calculateActivatedSkills(
	cards: SkillCardInfoTuple,
	index: FrozenDualStrategyIndex,
): DualStrategyInfo[] {
	// 配置快照：slot -> style（规范化后比对，碰撞语义消失：每个触发位固有单卡）
	const configured = new Map<Trigger, SectValue>();
	for ( const card of cards ) {
		if ( card.sect ) {
			configured.set( card.triggerName, canonicalOf( index, card.sect ) );
		}
	}

	// 配置少于 2 个流派，无法激活任何策略
	if ( configured.size < 2 ) {
		return [];
	}

	const activated: DualStrategyInfo[] = [];
	for ( const strategy of index.strategies ) {
		const primaryHit = hit( strategy.primary, configured, index );
		const secondaryHit = hit( strategy.secondary, configured, index );
		if ( !primaryHit || !secondaryHit ) continue;

		const primaryInTrigger = primaryHit.some( ( p ) => strategy.triggerSlots.includes( p.slot ) );
		const secondaryInTrigger = secondaryHit.some( ( p ) => strategy.triggerSlots.includes( p.slot ) );
		if ( primaryInTrigger || secondaryInTrigger ) {
			activated.push( strategy );
		}
	}

	return activated;
}

/**
 * 规范化流派：变体 -> canonical（寒冷(寒气爆发)/寒冷(聚寒成冰) -> 寒冷）
 */
function canonicalOf( index: FrozenDualStrategyIndex, style: SectValue ): SectValue {
	return index.canonicalStyle.get( style ) ?? style;
}

/**
 * 候选集命中检测
 * @param candidates - 某侧的候选条件集
 * @param configured - 配置快照（slot -> canonical style）
 * @param index - V2 只读索引（用于候选 style 规范化）
 * @returns 命中的候选子集；无命中返回 null
 */
function hit(
	candidates: readonly DualStrategyCondition[],
	configured: ReadonlyMap<Trigger, SectValue>,
	index: FrozenDualStrategyIndex,
): DualStrategyCondition[] | null {
	const hits: DualStrategyCondition[] = [];
	for ( const cond of candidates ) {
		if ( configured.get( cond.slot ) === canonicalOf( index, cond.style ) ) {
			hits.push( cond );
		}
	}
	return hits.length > 0 ? hits : null;
}

/**
 * 检查流派是否重复配置
 * @description 在添加新流派时，检查是否已在其他位置配置
 * @param cards - 技能位配置元组
 * @param sect - 要检查的流派
 * @param excludeTrigger - 排除的触发位（编辑时排除自身）
 * @returns 重复检测结果
 */
export function checkDuplicateSect(
	cards: SkillCardInfoTuple,
	sect: SectValue,
	excludeTrigger?: Trigger,
): DuplicateCheckResult {
	// 空流派不检查重复
	if ( !sect ) {
		return { isDuplicate: false };
	}

	const duplicateCard = cards.find(
		( card ) => card.sect === sect && card.triggerName !== excludeTrigger,
	);

	if ( duplicateCard ) {
		return {
			isDuplicate: true,
			duplicateTrigger: duplicateCard.triggerName,
		};
	}

	return { isDuplicate: false };
}

/**
 * 获取流派可用的触发位
 * @description 从 index.stylesBySlot 反查：流派出现在哪些触发位的可用列表
 * @param sect - 流派名称
 * @returns 支持的触发位列表
 */
export function getAvailableTriggersForSect( sect: SectValue | '' ): Trigger[] {
	if ( !sect ) return [];

	const index = getSkillIndex().value;
	if ( !index ) return [];

	const triggers: Trigger[] = [];
	for ( const [ slot, styles ] of index.stylesBySlot.entries() ) {
		if ( styles.includes( sect ) ) {
			triggers.push( slot );
		}
	}
	return triggers;
}

/**
 * 验证流派-触发位组合是否有效
 * @description 检查流派是否支持指定的触发位
 * @param sect - 流派名称
 * @param trigger - 触发位名称
 * @returns 是否为有效组合
 */
export function isValidSectTriggerCombination( sect: SectValue | '', trigger: Trigger ): boolean {
	if ( !sect ) return true; // 空流派默认有效

	const availableTriggers = getAvailableTriggersForSect( sect );
	return availableTriggers.includes( trigger );
}

/**
 * 获取流派冲突信息
 * @description 返回与指定流派冲突的所有已配置流派
 * @param cards - 技能位配置元组
 * @param sect - 要检查的流派
 * @param excludeTrigger - 排除的触发位
 * @returns 冲突的流派列表
 */
export function getSectConflicts(
	cards: SkillCardInfoTuple,
	sect: SectValue,
	excludeTrigger?: Trigger,
): SkillCardInfo[] {
	if ( !sect ) return [];

	return cards.filter(
		( card ) => card.sect === sect && card.triggerName !== excludeTrigger,
	);
}
