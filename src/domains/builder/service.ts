/**
 * Builder Domain Service
 * @description 构建逻辑服务 - 纯函数计算激活策略
 */

import type {
	ActivatedSkillResult,
	DuplicateCheckResult,
	SkillCardInfo,
	SkillCardInfoTuple,
} from './types.ts';
import type { SectValue } from '../config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SkillInfo } from '../../core/data/types.ts';
import { getSkillInfoList } from '../skill/repository.ts';

/**
 * 计算已激活的策略
 * @description 根据当前技能位配置，计算可激活的双重策略
 * @param cards - 技能位配置元组
 * @returns 激活的策略结果
 */
export function calculateActivatedSkills(cards: SkillCardInfoTuple): ActivatedSkillResult {
  const skillInfoList = getSkillInfoList().value;

  // 收集已配置的流派及其触发位
  const configuredSects = new Map<SectValue, Trigger>();
  cards.forEach((card) => {
    if (card.sect) {
      configuredSects.set(card.sect, card.triggerName);
    }
  });

  // 如果配置少于2个流派，无法激活任何策略
  if (configuredSects.size < 2) {
    return { skills: [], count: 0, skillNames: [] };
  }

  // 筛选可激活的策略
  const activatedSkills: SkillInfo[] = [];

  skillInfoList.forEach((skill) => {
    // 检查主流派是否已配置
    const mainTrigger = configuredSects.get(skill.mainSect);
    if (!mainTrigger) return;

    // 检查副流派是否已配置
    const secondTrigger = configuredSects.get(skill.secondSect);
    if (!secondTrigger) return;

    // 检查触发位是否匹配
    const hasValidTrigger =
      skill.trigger.includes(mainTrigger) || skill.trigger.includes(secondTrigger);

    if (hasValidTrigger) {
      activatedSkills.push(skill);
    }
  });

  const skillName = activatedSkills.map(skill => skill.name);
  
  return {
    skills: activatedSkills,
    count: activatedSkills.length,
    skillNames:skillName
  };
}

/**
 * 检查流派是否重复配置
 * @description 在添加新流派时，检查是否已在其他位置配置
 * @param cards - 技能位配置元组
 * @param sect - 要检查的流派
 * @param excludeTrigger - 排除的触发位（编辑时排除自身）
 * @returns 重复检测结果
 */
export function checkDuplicateSect(
  cards: SkillCardInfoTuple,
  sect: SectValue,
  excludeTrigger?: Trigger,
): DuplicateCheckResult {
  // 空流派不检查重复
  if (!sect) {
    return { isDuplicate: false };
  }

  const duplicateCard = cards.find(
    (card) => card.sect === sect && card.triggerName !== excludeTrigger,
  );

  if (duplicateCard) {
    return {
      isDuplicate: true,
      duplicateTrigger: duplicateCard.triggerName,
    };
  }

  return { isDuplicate: false };
}

/**
 * 获取流派可用的触发位
 * @description 从技能数据中获取指定流派支持的触发位列表
 * @param sect - 流派名称
 * @returns 支持的触发位列表
 */
export function getAvailableTriggersForSect(sect: SectValue | ''): Trigger[] {
  if (!sect) return [];

  const skillInfoList = getSkillInfoList().value;
  const triggers = new Set<Trigger>();

  skillInfoList.forEach((skill) => {
    if (skill.mainSect === sect || skill.secondSect === sect) {
      skill.trigger.forEach((t) => triggers.add(t));
    }
  });

  return Array.from(triggers);
}

/**
 * 验证流派-触发位组合是否有效
 * @description 检查流派是否支持指定的触发位
 * @param sect - 流派名称
 * @param trigger - 触发位名称
 * @returns 是否为有效组合
 */
export function isValidSectTriggerCombination(sect: SectValue | '', trigger: Trigger): boolean {
  if (!sect) return true; // 空流派默认有效

  const availableTriggers = getAvailableTriggersForSect(sect);
  return availableTriggers.includes(trigger);
}

/**
 * 获取流派冲突信息
 * @description 返回与指定流派冲突的所有已配置流派
 * @param cards - 技能位配置元组
 * @param sect - 要检查的流派
 * @param excludeTrigger - 排除的触发位
 * @returns 冲突的流派列表
 */
export function getSectConflicts(
  cards: SkillCardInfoTuple,
  sect: SectValue,
  excludeTrigger?: Trigger,
): SkillCardInfo[] {
  if (!sect) return [];

  return cards.filter(
    (card) => card.sect === sect && card.triggerName !== excludeTrigger,
  );
}
