/**
 * Builder Domain Types
 * @description 构建域类型定义 - 技能位配置和激活策略
 */

import type { SectValue } from '../config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SkillInfo } from '../../core/data/types.ts';

/**
 * 技能卡片信息接口
 * @description 单个技能位的配置信息
 */
export interface SkillCardInfo {
  /** 触发位名称 (普攻/技能/冲刺/传承/召唤) */
  triggerName: Trigger;
  /** 配置的流派名称，空字符串表示未配置 */
  sect: SectValue | '';
  /** 是否继承上位效果 */
  inherit: boolean;
  /** 继承的双重策略信息 */
  inheritSkill?: SkillInfo;
}

/**
 * 技能卡片信息元组
 * @description 5个固定技能位的配置数组，顺序为 [普攻, 技能, 冲刺, 传承, 召唤]
 */
export type SkillCardInfoTuple = [
  SkillCardInfo, // 普攻
  SkillCardInfo, // 技能
  SkillCardInfo, // 冲刺
  SkillCardInfo, // 传承
  SkillCardInfo, // 召唤
];

/**
 * 激活技能结果接口
 * @description 根据当前配置计算出的已激活策略
 */
export interface ActivatedSkillResult {
  /** 已激活的策略列表 */
  skills: SkillInfo[];
  /** 激活数量 */
  count: number;
  /**
   * 已激活的策略名称列表
   */
  skillNames: string[]
}

/**
 * 重复检测结果
 */
export interface DuplicateCheckResult {
  /** 是否重复 */
  isDuplicate: boolean;
  /** 重复的位置 */
  duplicateTrigger?: Trigger;
}
