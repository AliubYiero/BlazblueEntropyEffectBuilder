// src/domains/config/constants.ts
/**
 * 配置域常量
 * @description 流派、属性、触发位的常量数据
 */

import type { SectInfo, SectConfigMap, AttributeList, TriggerList } from './types.ts';

/**
 * 完整流派列表（36个流派）
 */
export const sectList: SectInfo[] = [
  {
    attribute: '火',
    sect: '燃烧',
    skill: [
      { name: '普攻燃烧', trigger: '普攻' },
      { name: '技能燃烧', trigger: '技能' },
      { name: '冲刺燃烧', trigger: '冲刺' },
    ],
  },
  {
    attribute: '火',
    sect: '火弹',
    skill: [
      { name: '技能火弹', trigger: '技能' },
      { name: '传承技火弹', trigger: '传承' },
    ],
  },
  {
    attribute: '火',
    sect: '火环',
    skill: [{ name: '传承技火环', trigger: '传承' }],
  },
  {
    attribute: '火',
    sect: '地雷',
    skill: [{ name: '放置地雷', trigger: '召唤' }],
  },
  {
    attribute: '火',
    sect: '火精灵',
    skill: [{ name: '火精灵助战', trigger: '普攻' }],
  },
  {
    attribute: '冰',
    sect: '寒冷',
    skill: [
      { name: '普攻寒冷', trigger: '普攻' },
      { name: '技能寒冷', trigger: '技能' },
    ],
  },
  {
    attribute: '冰',
    sect: '寒冷 (寒气爆发)',
    skill: [
      { name: '普攻寒冷 (寒气爆发)', trigger: '普攻' },
      { name: '技能寒冷 (寒气爆发)', trigger: '技能' },
    ],
  },
  {
    attribute: '冰',
    sect: '寒冷 (聚寒成冰)',
    skill: [
      { name: '普攻寒冷 (聚寒成冰)', trigger: '普攻' },
      { name: '技能寒冷 (聚寒成冰)', trigger: '技能' },
    ],
  },
  {
    attribute: '冰',
    sect: '冰锥',
    skill: [
      { name: '冲刺冰锥', trigger: '冲刺' },
      { name: '传承技冰锥', trigger: '传承' },
    ],
  },
  {
    attribute: '冰',
    sect: '冰刺',
    skill: [{ name: '召唤冰刺', trigger: '召唤' }],
  },
  {
    attribute: '冰',
    sect: '冰雹',
    skill: [
      { name: '技能冰雹', trigger: '技能' },
      { name: '传承技冰雹', trigger: '传承' },
    ],
  },
  {
    attribute: '冰',
    sect: '玄冰剑刃',
    skill: [{ name: '玄冰剑刃', trigger: '普攻' }],
  },
  {
    attribute: '电',
    sect: '感电',
    skill: [
      { name: '技能感电', trigger: '技能' },
      { name: '传承技感电', trigger: '传承' },
    ],
  },
  {
    attribute: '电',
    sect: '闪电链',
    skill: [
      { name: '普攻闪电', trigger: '普攻' },
      { name: '技能闪电', trigger: '技能' },
      { name: '电闪雷鸣', trigger: '传承' },
    ],
  },
  {
    attribute: '电',
    sect: '落雷',
    skill: [{ name: '冲刺落雷', trigger: '冲刺' }],
  },
  {
    attribute: '电',
    sect: '电球',
    skill: [{ name: '环绕电球', trigger: '召唤' }],
  },
  {
    attribute: '电',
    sect: '电桩',
    skill: [{ name: '传承技电桩', trigger: '传承' }],
  },
  {
    attribute: '毒',
    sect: '中毒',
    skill: [
      { name: '普攻淬毒', trigger: '普攻' },
      { name: '技能毒环', trigger: '技能' },
    ],
  },
  {
    attribute: '毒',
    sect: '史莱姆',
    skill: [{ name: '召唤史莱姆', trigger: '召唤' }],
  },
  {
    attribute: '毒',
    sect: '毒弹',
    skill: [{ name: '冲刺毒弹', trigger: '冲刺' }],
  },
  {
    attribute: '毒',
    sect: '毒液',
    skill: [
      { name: '技能毒液', trigger: '技能' },
      { name: '传承技毒液', trigger: '传承' },
    ],
  },
  {
    attribute: '毒',
    sect: '毒泡河豚',
    skill: [{ name: '传承技河豚', trigger: '传承' }],
  },
  {
    attribute: '暗',
    sect: '触手',
    skill: [{ name: '召唤触手', trigger: '召唤' }],
  },
  {
    attribute: '暗',
    sect: '影子',
    skill: [{ name: '冲刺影子', trigger: '冲刺' }],
  },
  {
    attribute: '暗',
    sect: '影刺',
    skill: [
      { name: '普攻影刺', trigger: '普攻' },
      { name: '技能影刺', trigger: '技能' },
    ],
  },
  {
    attribute: '暗',
    sect: '黑洞',
    skill: [{ name: '传承技黑洞', trigger: '传承' }],
  },
  {
    attribute: '暗',
    sect: '暗影标记',
    skill: [
      { name: '普攻影标', trigger: '普攻' },
      { name: '技能影标', trigger: '技能' },
    ],
  },
  {
    attribute: '光',
    sect: '光枪',
    skill: [
      { name: '技能光枪', trigger: '技能' },
      { name: '传承技光枪', trigger: '传承' },
    ],
  },
  {
    attribute: '光',
    sect: '闪光',
    skill: [{ name: '传承技闪光', trigger: '传承' }],
  },
  {
    attribute: '光',
    sect: '光波',
    skill: [{ name: '普攻光波', trigger: '普攻' }],
  },
  {
    attribute: '光',
    sect: '光阵',
    skill: [{ name: '召唤光阵', trigger: '召唤' }],
  },
  {
    attribute: '光',
    sect: '圣光标记',
    skill: [{ name: '圣光标记', trigger: '冲刺' }],
  },
  {
    attribute: '刃',
    sect: '飞剑',
    skill: [{ name: '冲刺飞剑', trigger: '冲刺' }],
  },
  {
    attribute: '刃',
    sect: '撕裂',
    skill: [
      { name: '普攻撕裂', trigger: '普攻' },
      { name: '技能撕裂', trigger: '技能' },
    ],
  },
  {
    attribute: '刃',
    sect: '刃环',
    skill: [{ name: '召唤刃环', trigger: '召唤' }],
  },
  {
    attribute: '刃',
    sect: '刀刃风暴',
    skill: [
      { name: '技能风暴', trigger: '技能' },
      { name: '传承技风暴', trigger: '传承' },
    ],
  },
  {
    attribute: '刃',
    sect: '飞刃',
    skill: [{ name: '普攻飞刃', trigger: '普攻' }],
  },
];

/**
 * 属性列表（7种元素）
 */
export const attributeList: AttributeList = ['火', '冰', '电', '毒', '暗', '光', '刃'] as const;

/**
 * 触发位列表（5个位置）
 */
export const triggerList: TriggerList = ['普攻', '技能', '冲刺', '传承', '召唤'] as const;

/**
 * 派系列表映射（向后兼容）
 * @deprecated 推荐使用 sectList 或 getSectsByAttribute()
 */
export const sectConfig: SectConfigMap = {
  '火': ['燃烧', '火弹', '火环', '地雷', '火精灵'],
  '冰': ['寒冷', '寒冷 (寒气爆发)', '寒冷 (聚寒成冰)', '冰锥', '冰刺', '冰雹', '玄冰剑刃'],
  '电': ['感电', '闪电链', '落雷', '电球', '电桩'],
  '毒': ['中毒', '史莱姆', '毒弹', '毒液', '毒泡河豚'],
  '暗': ['触手', '影子', '影刺', '黑洞', '暗影标记'],
  '光': ['光枪', '闪光', '光波', '光阵', '圣光标记'],
  '刃': ['飞剑', '撕裂', '刃环', '刀刃风暴', '飞刃'],
};
