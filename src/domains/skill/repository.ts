/**
 * Skill Domain Repository
 * @description 技能数据仓库 - 管理技能数据的加载、缓存和查询
 */

import { shallowRef, computed, type Ref, type ComputedRef } from 'vue';
import type { FrozenSkillInfoList } from '../../core/data/types.ts';
import { loadSkillData, getCachedSkillData } from '../../core/data/loader.ts';
import { getAttributeBySect } from '../config/utils.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { TriggerInfo, SkillFilter, SectAttributeMap } from './types.ts';

/**
 * 数据仓库状态
 */
let isInitialized = false;
const rawSkillData = shallowRef<FrozenSkillInfoList>([] as unknown as FrozenSkillInfoList);

/**
 * 初始化数据仓库
 * @description 加载技能数据并缓存
 */
export async function initializeRepository(): Promise<boolean> {
  if (isInitialized && rawSkillData.value.length > 0) {
    return true;
  }

  // 先检查缓存
  const cachedData = getCachedSkillData();
  if (cachedData && cachedData.length > 0) {
    rawSkillData.value = cachedData;
    isInitialized = true;
    console.log('[domains/skill/repository] 从缓存加载成功');
    return true;
  }

  // 加载数据
  const result = await loadSkillData();
  if (result.success) {
    rawSkillData.value = result.data;
    isInitialized = true;
    console.log('[domains/skill/repository] 数据加载成功');
    return true;
  } else {
    console.error('[domains/skill/repository] 数据加载失败:', result.error);
    return false;
  }
}

/**
 * 获取技能列表（响应式）
 */
export function getSkillInfoList(): Ref<FrozenSkillInfoList> {
  return rawSkillData;
}

/**
 * 获取流派-属性映射（计算属性）
 */
export function getSectAttributeMap(): ComputedRef<SectAttributeMap> {
  return computed(() => {
    const mapper = new Map<SectValue, Attribute>();
    rawSkillData.value.forEach((skill) => {
      // 为主流派和副流派都添加映射
      if (!mapper.has(skill.mainSect)) {
        const attr = getAttributeBySect(skill.mainSect);
        if (attr) mapper.set(skill.mainSect, attr);
      }
      if (!mapper.has(skill.secondSect)) {
        const attr = getAttributeBySect(skill.secondSect);
        if (attr) mapper.set(skill.secondSect, attr);
      }
    });
    return mapper;
  });
}

/**
 * 获取触发位信息列表（计算属性）
 * @description 从技能数据中派生每个流派支持的触发位
 */
export function getTriggerInfoList(): ComputedRef<readonly TriggerInfo[]> {
  return computed(() => {
    const sectTriggers = new Map<SectValue, Set<Trigger>>();

    rawSkillData.value.forEach((skill) => {
      // 为主流派和副流派都添加触发位
      [skill.mainSect, skill.secondSect].forEach((sect) => {
        if (!sectTriggers.has(sect)) {
          sectTriggers.set(sect, new Set());
        }
        skill.trigger.forEach((t) => sectTriggers.get(sect)?.add(t));
      });
    });

    return Object.freeze(
      Array.from(sectTriggers.entries()).map(([name, triggers]) => ({
        name,
        trigger: Array.from(triggers),
      })),
    );
  });
}

/**
 * 按属性筛选技能
 * @param attribute - 属性名称
 * @returns 匹配的技能列表（计算属性）
 */
export function filterByAttribute(attribute: Attribute) {
  return computed(() =>
    rawSkillData.value.filter(
      (skill) =>
        skill.mainAttribute === attribute || skill.secondAttribute === attribute,
    ),
  );
}

/**
 * 按流派筛选技能
 * @param sect - 流派名称
 * @returns 匹配的技能列表（计算属性）
 */
export function filterBySect(sect: SectValue) {
  return computed(() =>
    rawSkillData.value.filter(
      (skill) => skill.mainSect === sect || skill.secondSect === sect,
    ),
  );
}

/**
 * 按触发位筛选技能
 * @param trigger - 触发位名称
 * @returns 匹配的技能列表（计算属性）
 */
export function filterByTrigger(trigger: Trigger) {
  return computed(() =>
    rawSkillData.value.filter((skill) => skill.trigger.includes(trigger)),
  );
}

/**
 * 多条件筛选技能
 * @param filters - 筛选条件
 * @returns 匹配的技能列表（计算属性）
 */
export function filterSkills(filters: SkillFilter) {
  return computed(() => {
    return rawSkillData.value.filter((skill) => {
      // 属性筛选
      if (filters.attribute) {
        const matchesAttribute =
          skill.mainAttribute === filters.attribute ||
          skill.secondAttribute === filters.attribute;
        if (!matchesAttribute) return false;
      }

      // 流派筛选
      if (filters.sect) {
        const matchesSect =
          skill.mainSect === filters.sect || skill.secondSect === filters.sect;
        if (!matchesSect) return false;
      }

      // 触发位筛选
      if (filters.trigger) {
        const matchesTrigger = skill.trigger.includes(filters.trigger);
        if (!matchesTrigger) return false;
      }

      return true;
    });
  });
}

/**
 * 获取流派支持的触发位
 * @param sect - 流派名称
 * @returns 支持的触发位数组
 */
export function getValidTriggersForSect(sect: SectValue): Trigger[] {
  const triggerInfoList = getTriggerInfoList();
  const info = triggerInfoList.value.find((t) => t.name === sect);
  return info ? [...info.trigger] : [];
}

/**
 * 验证流派是否有效
 * @param sect - 流派名称
 * @returns 是否为有效流派
 */
export function isValidSect(sect: SectValue): boolean {
  const sectAttributeMap = getSectAttributeMap();
  return sectAttributeMap.value.has(sect);
}

/**
 * 根据流派获取属性
 * @param sect - 流派名称
 * @returns 对应的属性，如果未找到则返回 undefined
 */
export function getAttributeBySectValue(sect: SectValue): Attribute | undefined {
  const sectAttributeMap = getSectAttributeMap();
  return sectAttributeMap.value.get(sect);
}

/**
 * 重置仓库状态（用于测试）
 */
export function resetRepository(): void {
  isInitialized = false;
  rawSkillData.value = [];
}
