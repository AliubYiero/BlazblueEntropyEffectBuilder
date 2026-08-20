/**
 * Builder Domain Types
 * @description 构建域类型定义 - 技能位配置和激活策略
 */

import type { SectValue } from '../config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { DualStrategyInfo } from '../../core/data/types.ts';

/**
 * 技能卡片信息接口
 * @description 单个技能位的配置信息
 */
export interface SkillCardInfo {
  /** 触发位名称 (普攻/技能/冲刺/传承技/召唤) */
  triggerName: Trigger;
  /** 配置的流派名称，空字符串表示未配置 */
  sect: SectValue | '';
  /** 该触发位下该流派的技能名，查不到回退流派名，未配置为空字符串 */
  skillName: string;
  /**
   * 用户手动 pin 的双重策略 id
   * @description 粘性：不受流派配置变化影响，仅用户可增删（手动选择/删除）
   */
  manualSkillId?: string;
}

/**
 * 槽位分配结果
 * @description 某触发位当前占据的双重策略及其锁定状态（由配置派生，不可手动修改）
 */
export interface SlotAssignment {
  /** 触发位 */
  slot: Trigger;
  /** 占据的双重策略 */
  skill: DualStrategyInfo;
  /**
   * 是否锁定
   * @description 手动 pin / 自动单触发 / 自动多触发收窄到唯一剩余槽位 时为 true；
   * 多触发虚线预占时为 false
   */
  isLocked: boolean;
  /** 来源：手动 pin 或自动解析 */
  source: 'manual' | 'auto';
}

/**
 * 技能卡片信息元组
 * @description 5个固定技能位的配置数组，顺序为 [普攻, 技能, 冲刺, 传承技, 召唤]
 */
export type SkillCardInfoTuple = [
  SkillCardInfo, // 普攻
  SkillCardInfo, // 技能
  SkillCardInfo, // 冲刺
  SkillCardInfo, // 传承技
  SkillCardInfo, // 召唤
];

/**
 * 激活技能结果接口
 * @description 根据当前配置计算出的已激活策略（V2 新形状）
 */
export interface ActivatedSkillResult {
  /** 已激活的策略列表 */
  skills: DualStrategyInfo[];
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
