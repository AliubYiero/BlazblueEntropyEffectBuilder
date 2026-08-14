/**
 * Filter Domain Service
 * @description 筛选逻辑服务 - 纯函数实现（V2 新形状）
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../config/types.ts';
import type { DualStrategyInfo } from '../../core/data/types.ts';
import type { FilterState, AutocompleteSuggestion } from './types.ts';
import { sectList, triggerList } from '../config/constants.ts';
import { getAttributeBySect } from '../config/utils.ts';

/**
 * 应用筛选条件
 * @param strategies - 策略列表（V2 新形状）
 * @param state - 筛选状态
 * @returns 筛选后的策略列表
 */
export function applyFilter(
  strategies: readonly DualStrategyInfo[],
  state: FilterState,
): DualStrategyInfo[] {
  const { attribute, sect, sectCheckboxes, triggerCheckboxes } = state;

  // 获取未选中的触发位（用于过滤）
  const excludedTriggers = getExcludedTriggers(triggerCheckboxes);

  return strategies.filter((strategy) => {
    const primaryStyle = strategy.primary[0]?.style ?? '';
    const secondaryStyle = strategy.secondary[0]?.style ?? '';
    // 主侧属性为 element；副侧属性从副侧流派派生（混合属性策略）
    const secondaryAttr = getAttributeBySect(secondaryStyle) ?? strategy.element;

    // 流派匹配：主流派匹配 primary 首候选，副流派匹配 secondary 首候选
    const isMainMatch =
      sectCheckboxes.main &&
      matchesAttribute(strategy.element, attribute) &&
      matchesSect(primaryStyle, sect);

    const isSecondMatch =
      sectCheckboxes.second &&
      matchesAttribute(secondaryAttr, attribute) &&
      matchesSect(secondaryStyle, sect);

    // 触发位匹配：策略的 triggerSlots 不能全部在排除列表中
    const isTriggerMatch = !strategy.triggerSlots.every((t) => excludedTriggers.includes(t));

    return (isMainMatch || isSecondMatch) && isTriggerMatch;
  });
}

/**
 * 获取被排除的触发位列表
 * @param triggerCheckboxes - 触发位复选框状态
 * @returns 被排除的触发位列表
 */
function getExcludedTriggers(
  triggerCheckboxes: FilterState['triggerCheckboxes'],
): string[] {
  const excluded: string[] = [];
  if (!triggerCheckboxes.普攻) excluded.push('普攻');
  if (!triggerCheckboxes.技能) excluded.push('技能');
  if (!triggerCheckboxes.冲刺) excluded.push('冲刺');
  if (!triggerCheckboxes.传承技) excluded.push('传承技');
  if (!triggerCheckboxes.召唤) excluded.push('召唤');
  return excluded;
}

/**
 * 属性匹配检查
 * @param skillAttribute - 策略侧属性
 * @param filterAttribute - 筛选的属性
 * @returns 是否匹配
 */
function matchesAttribute(skillAttribute: Attribute, filterAttribute: Attribute | ''): boolean {
  if (!filterAttribute) return true;
  return skillAttribute === filterAttribute;
}

/**
 * 流派匹配检查
 * @param skillSect - 策略侧流派
 * @param filterSect - 筛选的流派
 * @returns 是否匹配
 */
function matchesSect(skillSect: SectValue, filterSect: SectValue | ''): boolean {
  if (!filterSect) return true;
  return skillSect.includes(filterSect);
}

/**
 * 获取属性建议列表
 * @param strategies - 策略列表
 * @param searchString - 搜索字符串
 * @returns 属性建议列表
 */
export function getAttributeSuggestions(
  strategies: readonly DualStrategyInfo[],
  searchString: string,
): AutocompleteSuggestion<Attribute>[] {
  const attributeSet = new Set<Attribute>();
  strategies.forEach((strategy) => {
    attributeSet.add(strategy.element);
    const secondaryAttr = getAttributeBySect(strategy.secondary[0]?.style ?? '');
    if (secondaryAttr) attributeSet.add(secondaryAttr);
  });

  const list = Array.from(attributeSet).map((attr) => ({ value: attr }));

  if (!searchString) return list;
  return list.filter((item) => item.value.includes(searchString));
}

/**
 * 获取流派建议列表
 * @param attribute - 当前选中的属性（可选）
 * @param searchString - 搜索字符串
 * @returns 流派建议列表
 */
export function getSectSuggestions(
  attribute: Attribute | '',
  searchString: string,
): AutocompleteSuggestion<SectValue>[] {
  // sectList 为流派命名权威，全部流派可用（Q5/Q8）
  const base = attribute
    ? sectList.filter((s) => s.attribute === attribute).map((s) => s.sect)
    : sectList.map((s) => s.sect);

  const list = base.map((sect) => ({ value: sect }));

  if (!searchString) return list;
  return list.filter((item) => item.value.includes(searchString));
}

/**
 * 检查筛选状态是否为空（无任何筛选条件）
 * @param state - 筛选状态
 * @returns 是否为空
 */
export function isFilterEmpty(state: FilterState): boolean {
  const hasAttribute = !!state.attribute;
  const hasSect = !!state.sect;
  const hasSectFilter = !state.sectCheckboxes.main || !state.sectCheckboxes.second;
  const hasTriggerFilter = !triggerList.every((t) => state.triggerCheckboxes[t]);

  return !hasAttribute && !hasSect && !hasSectFilter && !hasTriggerFilter;
}

/**
 * 检查触发位是否全部选中
 * @param triggerCheckboxes - 触发位复选框状态
 * @returns 是否全部选中
 */
export function areAllTriggersSelected(
  triggerCheckboxes: FilterState['triggerCheckboxes'],
): boolean {
  return triggerList.every((t) => triggerCheckboxes[t]);
}

/**
 * 检查流派复选框是否全部选中
 * @param sectCheckboxes - 流派复选框状态
 * @returns 是否全部选中
 */
export function areAllSectsSelected(
  sectCheckboxes: FilterState['sectCheckboxes'],
): boolean {
  return sectCheckboxes.main && sectCheckboxes.second;
}
