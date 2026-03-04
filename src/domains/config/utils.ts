// src/domains/config/utils.ts
/**
 * 配置域工具函数
 * @description 流派、属性相关的查询和验证函数
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from './types.ts';
import { sectList, sectConfig } from './constants.ts';

/**
 * 根据流派名称获取技能列表字符串
 * @param sectName - 流派名称
 * @returns 技能列表字符串（以 ' / ' 分隔），如果未找到则返回原流派名称
 */
export function getSkillsBySect(sectName: SectValue): string {
  const sect = sectList.find(s => s.sect === sectName);
  return sect ? sect.skill.join(' / ') : sectName;
}

/**
 * 根据流派名称获取属性
 * @param sect - 流派名称
 * @returns 对应的属性，如果未找到则返回 undefined
 */
export function getAttributeBySect(sect: SectValue): Attribute | undefined {
  const sectInfo = sectList.find(s => s.sect === sect);
  return sectInfo?.attribute;
}

/**
 * 根据属性获取流派列表
 * @param attribute - 属性
 * @returns 该属性下的所有流派名称列表
 */
export function getSectsByAttribute(attribute: Attribute): SectValue[] {
  return sectConfig[attribute] ?? [];
}

/**
 * 验证流派名称是否有效
 * @param sect - 流派名称
 * @returns 是否为有效流派
 */
export function isValidSect(sect: SectValue): boolean {
  return sectList.some(s => s.sect === sect);
}

/**
 * 获取所有流派名称列表
 * @returns 所有流派名称数组
 */
export function getAllSectNames(): SectValue[] {
  return sectList.map(s => s.sect);
}

/**
 * 获取流派信息
 * @param sect - 流派名称
 * @returns 流派信息对象，如果未找到则返回 undefined
 */
export function getSectInfo(sect: SectValue): { attribute: Attribute; sect: SectValue; skill: string[] } | undefined {
  return sectList.find(s => s.sect === sect);
}
