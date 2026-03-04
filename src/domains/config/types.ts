// src/domains/config/types.ts
/**
 * 配置域类型定义
 * @description 流派、属性、触发位相关的类型定义
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';

/**
 * 流派值类型（36个流派名称）
 * @note 使用 string 类型以支持完整的游戏数据，避免与旧接口不一致
 */
export type SectValue = string;

/**
 * 流派信息接口
 */
export interface SectInfo {
  /** 属性 */
  attribute: Attribute;
  /** 流派名称 */
  sect: SectValue;
  /** 技能列表 */
  skill: string[];
}

/**
 * 属性到流派列表的映射
 */
export type SectConfigMap = Record<Attribute, SectValue[]>;

/**
 * 属性列表类型（只读）
 */
export type AttributeList = readonly Attribute[];

/**
 * 触发位列表类型（只读）
 */
export type TriggerList = readonly Trigger[];
