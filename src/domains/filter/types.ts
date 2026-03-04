/**
 * Filter Domain Types
 * @description 筛选域类型定义
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../config/types.ts';
import type { SkillInfo } from '../../core/data/types.ts';

/**
 * 流派复选框状态
 */
export interface SectCheckboxState {
  /** 主流派匹配 */
  main: boolean;
  /** 副流派匹配 */
  second: boolean;
}

/**
 * 触发位复选框状态
 */
export interface TriggerCheckboxState {
  普攻: boolean;
  技能: boolean;
  冲刺: boolean;
  传承: boolean;
  召唤: boolean;
}

/**
 * 筛选状态
 */
export interface FilterState {
  /** 属性筛选 */
  attribute: Attribute | '';
  /** 流派筛选 */
  sect: SectValue | '';
  /** 流派复选框状态 */
  sectCheckboxes: SectCheckboxState;
  /** 触发位复选框状态 */
  triggerCheckboxes: TriggerCheckboxState;
}

/**
 * 筛选结果
 */
export interface FilterResult {
  /** 匹配的技能列表 */
  skills: SkillInfo[];
  /** 匹配数量 */
  count: number;
}

/**
 * 自动完成建议项
 */
export interface AutocompleteSuggestion<T = string> {
  value: T;
}

/**
 * 筛选状态快照（只读）
 */
export type ReadOnlyFilterState = Readonly<FilterState>;
