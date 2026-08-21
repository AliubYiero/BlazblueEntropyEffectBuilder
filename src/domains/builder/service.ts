/**
 * Builder Domain Service
 * @description 构建逻辑服务 - 纯函数计算激活策略
 */

import type {
	DuplicateCheckResult,
	SkillCardInfo,
	SkillCardInfoTuple,
	SlotAssignment,
} from './types.ts';
import type { SectValue } from '../config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type {
	DualStrategyCondition,
	DualStrategyInfo,
	FrozenDualStrategyIndex,
} from '../../core/data/types.ts';
import { getSkillIndex, getStrategyById } from '../skill/repository.ts';

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
 * 计算槽位分配：每触发位占据的双重策略 + 锁定状态（派生，不可手动修改）
 * @description 解析规则（设计定稿）：
 * - 手动 pin 优先：占据所选槽位并锁定（isLocked=true），且该策略不再参与自动解析（Q6=A）
 * - 自动单触发策略：锁定其唯一触发位
 * - 自动多触发策略：覆盖优先分槽——先做最大覆盖匹配（Kuhn 增广路径，索引序先到先得，
 *   每个策略至多 1 槽），再把剩余空槽按索引序认领。共享同一触发位集合的双重策略因此
 *   分槽并存，而非索引序前者独占全部共享槽位；当其它 triggerSlots 全部被锁定时收窄到
 *   唯一剩余槽位锁定。被 ≥2 个激活策略声明的竞争槽位分槽后自动锁定（isLocked=true）；
 *   无竞争预占槽位保持虚线（isLocked=false）
 * - 零剩余（triggerSlots 全部被锁定）：从槽位卡片消失，但仍计入已激活
 * @param cards - 技能位配置元组
 * @param calculated - 自然激活的策略列表（索引序）
 * @returns 触发位 -> 槽位分配（未分配/无策略时不包含）
 */
export function calculateSlotAssignments(
	cards: SkillCardInfoTuple,
	calculated: DualStrategyInfo[],
): Map<Trigger, SlotAssignment> {
	const assignments = new Map<Trigger, SlotAssignment>();
	const lockedSlots = new Set<Trigger>();
	const pinnedIds = new Set<string>();

	// 1. 手动 pin 优先（锁定，Q2-A：手动即锁定、只占用所选槽位）
	for ( const card of cards ) {
		if ( !card.manualSkillId ) continue;
		pinnedIds.add( card.manualSkillId );
		const skill = getStrategyById( card.manualSkillId );
		if ( !skill ) continue;
		assignments.set( card.triggerName, {
			slot: card.triggerName,
			skill,
			isLocked: true,
			source: 'manual',
		} );
		lockedSlots.add( card.triggerName );
	}

	// 2. 自动策略解析（索引序，不动点迭代直到不再变化）
	//    手动 pin 过的策略不再参与自动解析（Q6=A）
	const auto = calculated.filter( ( s ) => !pinnedIds.has( s.id ) );
	const resolved = new Set<string>();
	let changed = true;
	while ( changed ) {
		changed = false;
		for ( const skill of auto ) {
			if ( resolved.has( skill.id ) ) continue;
			const free = skill.triggerSlots.filter( ( t ) => !lockedSlots.has( t ) );
			if ( free.length === 0 ) {
				// 零剩余：不显示（Q3=A，但仍计入已激活）
				resolved.add( skill.id );
				continue;
			}
			if ( free.length === 1 ) {
				// 其它 triggerSlots 全部被锁定 → 收窄到唯一剩余槽位并锁定
				const slot = free[ 0 ];
				assignments.set( slot, { slot, skill, isLocked: true, source: 'auto' } );
				lockedSlots.add( slot );
				resolved.add( skill.id );
				changed = true;
			}
			// free.length > 1：虚线候选，最终 pass 处理
		}
	}

	// 3. 覆盖优先分槽（修订 Q3-A）：多触发策略竞争同一触发位集合时分槽并存，而非索引序前者独占全部槽位
	//    3a. 最大覆盖匹配（Kuhn 增广路径，索引序先到先得）：每个未解析策略至多 1 槽
	//    3b. 剩余空槽按索引序认领：让策略占满其 triggerSlots 中剩余的空槽
	//        → 单个无竞争策略仍占满所有 triggerSlots；被挤出者无槽但仍在已激活集合
	//    锁定规则：被 ≥2 个激活策略声明的竞争槽位，分槽后自动锁定（isLocked=true，只读）；
	//    无竞争预占槽位保持虚线（isLocked=false，可点击手动接管）
	const matchedSlotOf = new Map<string, Trigger>();      // strategyId -> 匹配槽位
	const matchedStrategyOf = new Map<Trigger, string>();  // 槽位 -> 已匹配的 strategyId
	const autoById = new Map( auto.map( ( s ) => [ s.id, s ] as const ) );

	// 每个触发位被多少个激活自动策略声明（竞争槽位 = 声明数 ≥ 2）
	const claimCount = new Map<Trigger, number>();
	for ( const skill of auto ) {
		for ( const t of skill.triggerSlots ) {
			claimCount.set( t, ( claimCount.get( t ) ?? 0 ) + 1 );
		}
	}
	const isContested = ( t: Trigger ): boolean => ( claimCount.get( t ) ?? 0 ) >= 2;

	// Kuhn 增广：为 skill 找槽位；已锁定槽（手动 pin / Pass 2）不参与匹配
	const augment = ( skill: DualStrategyInfo, visited: Set<Trigger> ): boolean => {
		for ( const t of skill.triggerSlots ) {
			if ( assignments.has( t ) || visited.has( t ) ) continue;
			visited.add( t );
			const ownerId = matchedStrategyOf.get( t );
			if ( ownerId === undefined ) {
				matchedSlotOf.set( skill.id, t );
				matchedStrategyOf.set( t, skill.id );
				return true;
			}
			const owner = autoById.get( ownerId );
			if ( owner && augment( owner, visited ) ) {
				matchedSlotOf.set( skill.id, t );
				matchedStrategyOf.set( t, skill.id );
				return true;
			}
		}
		return false;
	};

	for ( const skill of auto ) {
		if ( resolved.has( skill.id ) ) continue;
		augment( skill, new Set() );
	}

	// 3a 结果写入分配（竞争槽位锁定，无竞争虚线预占）
	for ( const [ skillId, slot ] of matchedSlotOf ) {
		const skill = autoById.get( skillId );
		if ( !skill ) continue;
		assignments.set( slot, { slot, skill, isLocked: isContested( slot ), source: 'auto' } );
	}

	// 3b 剩余空槽认领
	for ( const skill of auto ) {
		if ( resolved.has( skill.id ) ) continue;
		for ( const t of skill.triggerSlots ) {
			if ( assignments.has( t ) ) continue;
			assignments.set( t, { slot: t, skill, isLocked: isContested( t ), source: 'auto' } );
		}
	}

	return assignments;
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
