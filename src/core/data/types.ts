// src/core/data/types.ts
/**
 * 核心数据类型定义
 * @description 从 interfaces 迁移的核心类型
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { DoubleSkillName } from '../../interfaces/DoubleSkillName.ts';

/**
 * 双重技能信息接口
 */
export interface SkillInfo {
  name: DoubleSkillName;
  mainSect: SectValue;
  mainAttribute: Attribute;
  secondSect: SectValue;
  secondAttribute: Attribute;
  trigger: Trigger[];
  description: string;
}

/**
 * 冻结的技能数据类型
 */
export type FrozenSkillInfoList = readonly SkillInfo[];

/**
 * 数据加载结果类型
 */
export type DataLoadResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };
