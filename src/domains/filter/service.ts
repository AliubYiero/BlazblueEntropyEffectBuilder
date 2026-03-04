/**
 * Filter Domain Service
 * @description 筛选逻辑服务 - 纯函数实现
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../config/types.ts';
import type { SkillInfo } from '../../core/data/types.ts';
import type { FilterState, AutocompleteSuggestion } from './types.ts';
import { triggerList } from '../config/constants.ts';

/**
 * 应用筛选条件
 * @param skills - 技能列表
 * @param state - 筛选状态
 * @returns 筛选后的技能列表
 */
export function applyFilter(
  skills: readonly SkillInfo[],
  state: FilterState,
): SkillInfo[] {
  const { attribute, sect, sectCheckboxes, triggerCheckboxes } = state;

  // 获取未选中的触发位（用于过滤）
  const excludedTriggers = getExcludedTriggers(triggerCheckboxes);

  return skills.filter((skill) => {
    // 流派匹配检查
    const isMainMatch =
      sectCheckboxes.main &&
      matchesAttribute(skill.mainAttribute, attribute) &&
      matchesSect(skill.mainSect, sect);

    const isSecondMatch =
      sectCheckboxes.second &&
      matchesAttribute(skill.secondAttribute, attribute) &&
      matchesSect(skill.secondSect, sect);

    // 触发位匹配检查：技能的所有触发位都不能在排除列表中
    const isTriggerMatch = !skill.trigger.every((t) => excludedTriggers.includes(t));

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
  if (!triggerCheckboxes.传承) excluded.push('传承');
  if (!triggerCheckboxes.召唤) excluded.push('召唤');
  return excluded;
}

/**
 * 属性匹配检查
 * @param skillAttribute - 技能的属性
 * @param filterAttribute - 筛选的属性
 * @returns 是否匹配
 */
function matchesAttribute(skillAttribute: Attribute, filterAttribute: Attribute | ''): boolean {
  if (!filterAttribute) return true;
  return skillAttribute === filterAttribute;
}

/**
 * 流派匹配检查
 * @param skillSect - 技能的流派
 * @param filterSect - 筛选的流派
 * @returns 是否匹配
 */
function matchesSect(skillSect: SectValue, filterSect: SectValue | ''): boolean {
  if (!filterSect) return true;
  return skillSect.includes(filterSect);
}

/**
 * 获取属性建议列表
 * @param skills - 技能列表
 * @param searchString - 搜索字符串
 * @returns 属性建议列表
 */
export function getAttributeSuggestions(
  skills: readonly SkillInfo[],
  searchString: string,
): AutocompleteSuggestion<Attribute>[] {
  const attributeSet = new Set<Attribute>();
  skills.forEach((skill) => {
    attributeSet.add(skill.mainAttribute);
  });

  const list = Array.from(attributeSet).map((attr) => ({ value: attr }));

  if (!searchString) return list;
  return list.filter((item) => item.value.includes(searchString));
}

/**
 * 获取流派建议列表
 * @param skills - 技能列表
 * @param attribute - 当前选中的属性（可选）
 * @param searchString - 搜索字符串
 * @param sectConfig - 属性到流派的映射配置
 * @returns 流派建议列表
 */
export function getSectSuggestions(
  skills: readonly SkillInfo[],
  attribute: Attribute | '',
  searchString: string,
  sectConfig: Record<Attribute, SectValue[]>,
): AutocompleteSuggestion<SectValue>[] {
  let list: AutocompleteSuggestion<SectValue>[];

  // 如果选中了属性，使用配置中的流派列表
  if (attribute) {
    list = sectConfig[attribute].map((sect) => ({ value: sect }));
  } else {
    // 否则从技能数据中提取所有流派
    const sectSet = new Set<SectValue>();
    skills.forEach((skill) => {
      sectSet.add(skill.mainSect);
    });
    list = Array.from(sectSet).map((sect) => ({ value: sect }));
  }

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
