/**
 * Skill Domain Types
 * @description 技能域类型定义
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';

/**
 * 触发位信息接口
 */
export interface TriggerInfo {
  /** 流派名称 */
  name: SectValue;
  /** 支持的触发位列表 */
  trigger: Trigger[];
}

/**
 * 技能筛选条件
 */
export interface SkillFilter {
  /** 属性筛选 */
  attribute?: Attribute | '';
  /** 流派筛选 */
  sect?: SectValue | '';
  /** 触发位筛选 */
  trigger?: Trigger;
}

/**
 * 流派-属性映射类型
 */
export type SectAttributeMap = Map<SectValue, Attribute>;
