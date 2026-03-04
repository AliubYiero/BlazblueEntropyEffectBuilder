/**
 * Filter Domain Store
 * @description 筛选状态管理 - Pinia Store
 */

import { defineStore } from 'pinia';
import { ref, computed, reactive, readonly, type ComputedRef } from 'vue';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../config/types.ts';
import type {
  FilterState,
  FilterResult,
  SectCheckboxState,
  TriggerCheckboxState,
  ReadOnlyFilterState,
} from './types.ts';
import { applyFilter } from './service.ts';
import { getSkillInfoList } from '../skill/repository.ts';

/**
 * 默认流派复选框状态
 */
const defaultSectCheckboxes: SectCheckboxState = {
  main: true,
  second: true,
};

/**
 * 默认触发位复选框状态
 */
const defaultTriggerCheckboxes: TriggerCheckboxState = {
  普攻: true,
  技能: true,
  冲刺: true,
  传承: true,
  召唤: true,
};

/**
 * 筛选状态 Store
 * @description 管理双重词条筛选的状态和逻辑
 */
export const useFilterStore = defineStore('filter', () => {
  // ==================== State ====================

  /** 属性筛选 */
  const attribute = ref<Attribute | ''>('');

  /** 流派筛选 */
  const sect = ref<SectValue | ''>('');

  /** 流派复选框状态 */
  const sectCheckboxes = reactive<SectCheckboxState>({ ...defaultSectCheckboxes });

  /** 触发位复选框状态 */
  const triggerCheckboxes = reactive<TriggerCheckboxState>({ ...defaultTriggerCheckboxes });

  // ==================== Getters ====================

  /**
   * 只读的筛选状态快照
   */
  const readOnlyState: ComputedRef<ReadOnlyFilterState> = computed(() => {
    return readonly({
      attribute: attribute.value,
      sect: sect.value,
      sectCheckboxes: { ...sectCheckboxes },
      triggerCheckboxes: { ...triggerCheckboxes },
    }) as ReadOnlyFilterState;
  });

  /**
   * 筛选结果
   */
  const filterResult: ComputedRef<FilterResult> = computed(() => {
    const skills = getSkillInfoList().value;
    const state: FilterState = {
      attribute: attribute.value,
      sect: sect.value,
      sectCheckboxes: { ...sectCheckboxes },
      triggerCheckboxes: { ...triggerCheckboxes },
    };
    const filteredSkills = applyFilter(skills, state);
    return {
      skills: filteredSkills,
      count: filteredSkills.length,
    };
  });

  // ==================== Actions ====================

  /**
   * 设置属性筛选
   * @param value - 属性值
   */
  function setAttribute(value: Attribute | ''): void {
    attribute.value = value;
    // 清空流派时，同时清空流派筛选
    if (!value) {
      sect.value = '';
    }
  }

  /**
   * 设置流派筛选
   * @param value - 流派值
   */
  function setSect(value: SectValue | ''): void {
    sect.value = value;
  }

  /**
   * 切换流派复选框
   * @param key - 复选框键名
   * @param value - 是否选中
   */
  function toggleSectCheckbox(key: keyof SectCheckboxState, value: boolean): void {
    sectCheckboxes[key] = value;
  }

  /**
   * 切换触发位复选框
   * @param key - 复选框键名
   * @param value - 是否选中
   */
  function toggleTriggerCheckbox(key: keyof TriggerCheckboxState, value: boolean): void {
    triggerCheckboxes[key] = value;
  }

  /**
   * 重置筛选条件
   */
  function resetFilter(): void {
    attribute.value = '';
    sect.value = '';
    Object.assign(sectCheckboxes, defaultSectCheckboxes);
    Object.assign(triggerCheckboxes, defaultTriggerCheckboxes);
  }

  /**
   * 重置流派复选框为默认值
   */
  function resetSectCheckboxes(): void {
    Object.assign(sectCheckboxes, defaultSectCheckboxes);
  }

  /**
   * 重置触发位复选框为默认值
   */
  function resetTriggerCheckboxes(): void {
    Object.assign(triggerCheckboxes, defaultTriggerCheckboxes);
  }

  return {
    // State
    attribute,
    sect,
    sectCheckboxes,
    triggerCheckboxes,
    // Getters
    readOnlyState,
    filterResult,
    // Actions
    setAttribute,
    setSect,
    toggleSectCheckbox,
    toggleTriggerCheckbox,
    resetFilter,
    resetSectCheckboxes,
    resetTriggerCheckboxes,
  };
});
