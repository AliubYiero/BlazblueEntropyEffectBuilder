// src/core/data/types.ts
/**
 * 核心数据类型定义
 * @description 从 interfaces 迁移的核心类型
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../domains/config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';

/**
 * 策略的单个候选条件：某个触发位上装配的某个流派
 */
export interface DualStrategyCondition {
  /** 触发位（普攻/技能/冲刺/传承技/召唤） */
  slot: Trigger;
  /** 流派（命名对齐 sectList） */
  style: SectValue;
  /** 具体技能名，如「普攻燃烧」 */
  name: string;
}

/**
 * 双重策略（V2 的 dualStrategies 元素）
 */
export interface DualStrategyInfo {
  /** 稳定主键（去重/继承/持久化用） */
  id: string;
  /** 显示名 */
  name: string;
  /** 主侧流派属性（V2 element 恒等于 primary 首候选流派属性） */
  element: Attribute;
  /** 触发位（显式检查） */
  triggerSlots: Trigger[];
  /** 主条件候选集（单一流派，多槽位） */
  primary: DualStrategyCondition[];
  /** 副条件候选集（单一流派，多槽位） */
  secondary: DualStrategyCondition[];
  /** 描述 */
  description: string;
}

/**
 * 加载时一次性构建的只读索引
 */
export interface DualStrategyIndex {
  /** 全部策略 */
  strategies: readonly DualStrategyInfo[];
  /** (slot, style) 规范化后 -> 策略 id 列表 */
  bySlotStyle: ReadonlyMap<string, readonly string[]>;
  /** 别名展开：变体 style -> canonical style（寒冷(寒气爆发) -> 寒冷） */
  canonicalStyle: ReadonlyMap<SectValue, SectValue>;
  /** 由 V2.slots 派生：触发位 -> 可用流派列表 */
  stylesBySlot: ReadonlyMap<Trigger, readonly SectValue[]>;
}

/**
 * 冻结的双重策略索引
 */
export type FrozenDualStrategyIndex = Readonly<DualStrategyIndex>;

/**
 * 数据加载结果类型
 */
export type DataLoadResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };
