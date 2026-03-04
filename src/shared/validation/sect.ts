/**
 * Sect Validation Functions
 * @description 流派验证纯函数 - 与 UI 框架解耦的验证逻辑
 */

import type { SectValue } from '../../domains/config/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SkillCardInfo } from '../../domains/builder/types.ts';
import { getValidTriggersForSect, getAttributeBySectValue } from '../../domains/skill/repository.ts';

/**
 * 验证结果接口
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 错误信息（仅在 valid 为 false 时存在） */
  message?: string;
}

/**
 * 验证流派是否支持指定触发位
 * @param sect - 流派名称
 * @param trigger - 触发位名称
 * @returns 验证结果
 */
export function validateSectTriggerMatch(
  sect: SectValue | '',
  trigger: Trigger,
): ValidationResult {
  if (!sect) {
    return { valid: true };
  }

  const validTriggers = getValidTriggersForSect(sect);
  if (validTriggers.length === 0) {
    return { valid: false, message: '无效的流派名称' };
  }

  if (!validTriggers.includes(trigger)) {
    return { valid: false, message: `该流派无法在【${trigger}】位使用` };
  }

  return { valid: true };
}

/**
 * 验证流派是否重复配置
 * @param sect - 流派名称
 * @param cards - 所有技能卡片配置
 * @param excludeTrigger - 排除的触发位（当前正在编辑的位置）
 * @returns 验证结果
 */
export function validateDuplicateSect(
  sect: SectValue | '',
  cards: SkillCardInfo[],
  excludeTrigger: Trigger,
): ValidationResult {
  if (!sect) {
    return { valid: true };
  }

  const existingCard = cards.find(
    (card) => card.sect === sect && card.triggerName !== excludeTrigger,
  );

  if (existingCard) {
    return {
      valid: false,
      message: `该流派已在【${existingCard.triggerName}】位配置`,
    };
  }

  return { valid: true };
}

/**
 * 验证流派与属性是否匹配
 * @param sect - 流派名称
 * @param attribute - 属性名称
 * @returns 是否匹配
 */
export function validateAttributeMatch(
  sect: SectValue | '',
  attribute: Attribute | '',
): boolean {
  if (!sect || !attribute) {
    return true;
  }

  const actualAttribute = getAttributeBySectValue(sect);
  return actualAttribute === attribute;
}

/**
 * 组合验证 - 验证流派配置的所有条件
 * @param sect - 流派名称
 * @param trigger - 触发位名称
 * @param cards - 所有技能卡片配置
 * @returns 验证结果
 */
export function validateSect(
  sect: SectValue | '',
  trigger: Trigger,
  cards: SkillCardInfo[],
): ValidationResult {
  // 空值通过验证（非必填场景）
  if (!sect) {
    return { valid: true };
  }

  // 验证流派是否支持触发位
  const triggerResult = validateSectTriggerMatch(sect, trigger);
  if (!triggerResult.valid) {
    return triggerResult;
  }

  // 验证流派是否重复
  const duplicateResult = validateDuplicateSect(sect, cards, trigger);
  if (!duplicateResult.valid) {
    return duplicateResult;
  }

  return { valid: true };
}
