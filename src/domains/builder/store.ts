/**
 * Builder Domain Store
 * @description 构建状态管理 - 管理技能位配置
 */

import { defineStore } from 'pinia';
import { shallowRef, computed, readonly } from 'vue';
import type { SkillCardInfoTuple, SkillCardInfo, ActivatedSkillResult } from './types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SectValue } from '../config/types.ts';
import { calculateActivatedSkills, checkDuplicateSect } from './service.ts';
import { isValidSect } from '../skill/repository.ts';

/**
 * 默认技能卡片配置
 */
const DEFAULT_SKILL_CARDS: SkillCardInfoTuple = [
  { triggerName: '普攻', sect: '', inherit: false },
  { triggerName: '技能', sect: '', inherit: false },
  { triggerName: '冲刺', sect: '', inherit: false },
  { triggerName: '传承', sect: '', inherit: false },
  { triggerName: '召唤', sect: '', inherit: false },
];

/**
 * 有效的触发位列表
 */
const VALID_TRIGGERS: Trigger[] = ['普攻', '技能', '冲刺', '传承', '召唤'];

/**
 * 构建状态 Store
 * @description 管理5个技能位的流派配置，使用 shallowRef 优化性能
 */
export const useBuilderStore = defineStore('builder', () => {
  // ==================== State ====================

  /**
   * 技能卡片信息列表
   * @description 使用 shallowRef 替代 reactive，避免深层响应式代理开销
   */
  const skillCardInfoList = shallowRef<SkillCardInfoTuple>(structuredClone(DEFAULT_SKILL_CARDS));

  // ==================== Getters ====================

  /**
   * 只读卡片列表
   * @description 提供只读访问，防止外部直接修改
   */
  const readOnlyCardList = computed(() => readonly(skillCardInfoList.value));

  /**
   * 已激活的策略
   * @description 根据当前配置计算已激活的双重策略
   */
  const activatedSkills = computed<ActivatedSkillResult>(() => {
    return calculateActivatedSkills(skillCardInfoList.value);
  });

  /**
   * 已配置的流派数量
   */
  const configuredCount = computed(() => {
    return skillCardInfoList.value.filter((card) => card.sect).length;
  });

  /**
   * 是否有配置
   */
  const hasConfiguration = computed(() => {
    return configuredCount.value > 0;
  });

  // ==================== Actions ====================

  /**
   * 更新卡片流派信息
   * @param triggerName - 触发位名称
   * @param sect - 流派名称
   */
  const updateSkillCardInfo = (triggerName: Trigger, sect: SectValue | ''): boolean => {
    // 防御性编程：验证 triggerName 有效性
    if (!VALID_TRIGGERS.includes(triggerName)) {
      console.warn(`[useBuilderStore] 无效的触发位: ${triggerName}`);
      return false;
    }

    // 防御性编程：验证 sect 有效性（允许空字符串）
    if (sect && !isValidSect(sect)) {
      console.warn(`[useBuilderStore] 无效的流派: ${sect}`);
      return false;
    }

    // 创建新数组以触发 shallowRef 更新
    const newList = skillCardInfoList.value.map((item) =>
      item.triggerName === triggerName ? { ...item, sect } : item,
    ) as SkillCardInfoTuple;

    skillCardInfoList.value = newList;
    return true;
  };

  /**
   * 更新卡片继承状态
   * @param triggerName - 触发位名称
   * @param inherit - 是否继承
   */
  const updateSkillCardInherit = (triggerName: Trigger, inherit: boolean): boolean => {
    // 防御性编程：验证 triggerName 有效性
    if (!VALID_TRIGGERS.includes(triggerName)) {
      console.warn(`[useBuilderStore] 无效的触发位: ${triggerName}`);
      return false;
    }

    // 创建新数组以触发 shallowRef 更新
    const newList = skillCardInfoList.value.map((item) =>
      item.triggerName === triggerName ? { ...item, inherit } : item,
    ) as SkillCardInfoTuple;

    skillCardInfoList.value = newList;
    return true;
  };

  /**
   * 获取指定触发位的卡片信息
   * @param triggerName - 触发位名称
   */
  const getSkillCardByTrigger = (triggerName: Trigger): SkillCardInfo | undefined => {
    return skillCardInfoList.value.find((item) => item.triggerName === triggerName);
  };

  /**
   * 检查流派是否重复配置
   * @param sect - 要检查的流派
   * @param excludeTrigger - 排除的触发位（用于编辑时排除自身）
   */
  const checkSectDuplicate = (sect: SectValue, excludeTrigger?: Trigger) => {
    return checkDuplicateSect(skillCardInfoList.value, sect, excludeTrigger);
  };

  /**
   * 重置所有卡片信息
   */
  const resetAllSkillCards = (): void => {
    skillCardInfoList.value = structuredClone(DEFAULT_SKILL_CARDS);
  };

  /**
   * 导出当前配置
   * @description 用于本地存储
   */
  const exportConfiguration = (): SkillCardInfoTuple => {
    return structuredClone(skillCardInfoList.value);
  };

  /**
   * 导入配置
   * @description 从本地存储恢复
   */
  const importConfiguration = (config: SkillCardInfoTuple): boolean => {
    // 简单验证
    if (!Array.isArray(config) || config.length !== 5) {
      console.warn('[useBuilderStore] 导入配置失败：格式无效');
      return false;
    }

    skillCardInfoList.value = config;
    return true;
  };

  return {
    // State
    skillCardInfoList,

    // Getters
    readOnlyCardList,
    activatedSkills,
    configuredCount,
    hasConfiguration,

    // Actions
    updateSkillCardInfo,
    updateSkillCardInherit,
    getSkillCardByTrigger,
    checkSectDuplicate,
    resetAllSkillCards,
    exportConfiguration,
    importConfiguration,
  };
});
