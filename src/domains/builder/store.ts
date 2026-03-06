/**
 * Builder Domain Store
 * @description 构建状态管理 - 管理技能位配置
 */

import { defineStore } from 'pinia';
import { shallowRef, computed, readonly } from 'vue';
import type { SkillCardInfoTuple, SkillCardInfo, ActivatedSkillResult } from './types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SectValue } from '../config/types.ts';
import type { SkillInfo } from '../../core/data/types.ts';
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
   * 自然激活的策略（不含继承）
   * @description 仅通过流派配置自然激活的双重策略，用于三态判断
   */
  const calculatedSkills = computed<SkillInfo[]>(() => {
    return calculateActivatedSkills(skillCardInfoList.value).skills;
  });

  /**
   * 已激活的策略
   * @description 根据当前配置计算已激活的双重策略
   */
  const activatedSkills = computed<ActivatedSkillResult>(() => {
    const skills = calculatedSkills.value;

    // 合并继承的双重策略（去重）
    const inheritedSkills = skillCardInfoList.value
      .filter((card) => card.inherit && card.inheritSkill)
      .map((card) => card.inheritSkill!);

    const calculatedNames = new Set(skills.map((s) => s.name));
    const uniqueInherited = inheritedSkills.filter((s) => !calculatedNames.has(s.name));
    const allSkills = [...skills, ...uniqueInherited];

    return {
      skills: allSkills,
      count: allSkills.length,
    };
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
    // 先清除不再有效的继承，再自动继承单触发位的双重策略
    clearInvalidInheritedSkills();
    autoInheritSingleTriggerSkills();
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
   * 设置继承的双重策略
   * @param triggerName - 触发位名称
   * @param skill - 要继承的双重策略
   */
  const setInheritSkill = (triggerName: Trigger, skill: SkillInfo): boolean => {
    if (!VALID_TRIGGERS.includes(triggerName)) {
      console.warn(`[useBuilderStore] 无效的触发位: ${triggerName}`);
      return false;
    }

    const newList = skillCardInfoList.value.map((item) =>
      item.triggerName === triggerName
        ? { ...item, inherit: true, inheritSkill: skill }
        : item,
    ) as SkillCardInfoTuple;

    skillCardInfoList.value = newList;
    return true;
  };

  /**
   * 清除继承的双重策略
   * @param triggerName - 触发位名称
   */
  const clearInheritSkill = (triggerName: Trigger): boolean => {
    if (!VALID_TRIGGERS.includes(triggerName)) {
      console.warn(`[useBuilderStore] 无效的触发位: ${triggerName}`);
      return false;
    }

    const newList = skillCardInfoList.value.map((item) =>
      item.triggerName === triggerName
        ? { ...item, inherit: false, inheritSkill: undefined }
        : item,
    ) as SkillCardInfoTuple;

    skillCardInfoList.value = newList;
    return true;
  };

  /**
   * 清除不再有效的继承
   * @description 当流派配置变化时，清除 inheritSkill 对应策略已不在激活列表中的继承
   */
  const clearInvalidInheritedSkills = (): void => {
    const calculated = calculateActivatedSkills(skillCardInfoList.value);
    const activatedNames = new Set(calculated.skills.map((s) => s.name));
    let changed = false;
    let current = skillCardInfoList.value;

    for (const card of current) {
      if (card.inherit && card.inheritSkill && !activatedNames.has(card.inheritSkill.name)) {
        current = current.map((item) =>
          item.triggerName === card.triggerName
            ? { ...item, inherit: false, inheritSkill: undefined }
            : item,
        ) as SkillCardInfoTuple;
        changed = true;
      }
    }

    if (changed) {
      skillCardInfoList.value = current;
    }
  };

  /**
   * 自动设置单触发位和最后剩余触发位的继承
   * @description 当激活策略变化时调用，自动勾选确定性的触发位
   */
  const autoInheritSingleTriggerSkills = (): void => {
    const calculated = calculateActivatedSkills(skillCardInfoList.value);
    let changed = false;
    let current = skillCardInfoList.value;

    for (const skill of calculated.skills) {
      if (skill.trigger.length === 1) {
        const trigger = skill.trigger[0];
        const card = current.find((c) => c.triggerName === trigger);
        if (card && !card.inherit) {
          current = current.map((item) =>
            item.triggerName === trigger
              ? { ...item, inherit: true, inheritSkill: skill }
              : item,
          ) as SkillCardInfoTuple;
          changed = true;
        }
      }
    }

    if (changed) {
      skillCardInfoList.value = current;
    }
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

  /**
   * 获取触发位的勾选框三态状态
   * @description 基于自然激活策略计算，继承的策略不影响其他触发位
   * @param trigger - 触发位名称
   * @returns 'checked' | 'pending' | 'unchecked'
   */
  const getCheckboxState = (trigger: Trigger): 'checked' | 'pending' | 'unchecked' => {
    const card = skillCardInfoList.value.find((c) => c.triggerName === trigger);
    if (card?.inherit) return 'checked';

    const related = calculatedSkills.value.filter((s) => s.trigger.includes(trigger));
    if (related.length === 0) return 'unchecked';

    for (const skill of related) {
      if (skill.trigger.length === 1) return 'checked';

      const otherTriggers = skill.trigger.filter((t) => t !== trigger);
      const allOthersChecked = otherTriggers.every((t) => {
        const otherCard = skillCardInfoList.value.find((c) => c.triggerName === t);
        return otherCard?.inherit;
      });
      if (allOthersChecked) return 'checked';
    }

    return 'pending';
  };

  return {
    // State
    skillCardInfoList,

    // Getters
    readOnlyCardList,
    activatedSkills,
    configuredCount,
    hasConfiguration,
    calculatedSkills,

    // Actions
    updateSkillCardInfo,
    updateSkillCardInherit,
    setInheritSkill,
    clearInheritSkill,
    clearInvalidInheritedSkills,
    autoInheritSingleTriggerSkills,
    getSkillCardByTrigger,
    checkSectDuplicate,
    resetAllSkillCards,
    exportConfiguration,
    importConfiguration,
    getCheckboxState,
  };
});
