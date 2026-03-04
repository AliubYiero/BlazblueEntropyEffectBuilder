// src/domains/config/constants.ts
/**
 * 配置域常量
 * @description 流派、属性、触发位的常量数据
 */

import type { Attribute } from '../../interfaces/Attribute.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { SectInfo, SectConfigMap, AttributeList, TriggerList } from './types.ts';

/**
 * 完整流派列表（36个流派）
 */
export const sectList: SectInfo[] = [
  { attribute: '火', sect: '燃烧', skill: ['普攻燃烧', '技能燃烧', '冲刺燃烧'] },
  { attribute: '火', sect: '火弹', skill: ['技能火弹', '传承技火弹'] },
  { attribute: '火', sect: '火环', skill: ['传承技火环'] },
  { attribute: '火', sect: '地雷', skill: ['放置地雷'] },
  { attribute: '火', sect: '火精灵', skill: ['火精灵助战'] },
  { attribute: '冰', sect: '寒冷', skill: ['普攻寒冷', '技能寒冷'] },
  { attribute: '冰', sect: '寒冷 (寒气爆发)', skill: ['普攻寒冷 (寒气爆发)', '技能寒冷 (寒气爆发)'] },
  { attribute: '冰', sect: '寒冷 (聚寒成冰)', skill: ['普攻寒冷 (聚寒成冰)', '技能寒冷 (聚寒成冰)'] },
  { attribute: '冰', sect: '冰锥', skill: ['冲刺冰锥', '传承技冰锥'] },
  { attribute: '冰', sect: '冰刺', skill: ['召唤冰刺'] },
  { attribute: '冰', sect: '冰雹', skill: ['技能冰雹', '传承技冰雹'] },
  { attribute: '冰', sect: '玄冰剑刃', skill: ['玄冰剑刃'] },
  { attribute: '电', sect: '感电', skill: ['技能感电', '传承技感电'] },
  { attribute: '电', sect: '闪电链', skill: ['普攻闪电', '技能闪电', '电闪雷鸣'] },
  { attribute: '电', sect: '落雷', skill: ['冲刺落雷'] },
  { attribute: '电', sect: '电球', skill: ['环绕电球'] },
  { attribute: '电', sect: '电桩', skill: ['传承技电桩'] },
  { attribute: '毒', sect: '中毒', skill: ['普攻淬毒', '技能毒环'] },
  { attribute: '毒', sect: '史莱姆', skill: ['召唤史莱姆'] },
  { attribute: '毒', sect: '毒弹', skill: ['冲刺毒弹'] },
  { attribute: '毒', sect: '毒液', skill: ['技能毒液', '传承技毒液'] },
  { attribute: '毒', sect: '毒泡河豚', skill: ['传承技河豚'] },
  { attribute: '暗', sect: '触手', skill: ['召唤触手'] },
  { attribute: '暗', sect: '影子', skill: ['冲刺影子'] },
  { attribute: '暗', sect: '影刺', skill: ['普攻影刺', '技能影刺'] },
  { attribute: '暗', sect: '黑洞', skill: ['传承技黑洞'] },
  { attribute: '暗', sect: '暗影标记', skill: ['普攻影标', '技能影标'] },
  { attribute: '光', sect: '光枪', skill: ['技能光枪', '传承技光枪'] },
  { attribute: '光', sect: '闪光', skill: ['传承技闪光'] },
  { attribute: '光', sect: '光波', skill: ['普攻光波'] },
  { attribute: '光', sect: '光阵', skill: ['召唤光阵'] },
  { attribute: '光', sect: '圣光标记', skill: ['圣光标记'] },
  { attribute: '刃', sect: '飞剑', skill: ['冲刺飞剑'] },
  { attribute: '刃', sect: '撕裂', skill: ['普攻撕裂', '技能撕裂'] },
  { attribute: '刃', sect: '刃环', skill: ['召唤刃环'] },
  { attribute: '刃', sect: '刀刃风暴', skill: ['技能风暴', '传承技风暴'] },
  { attribute: '刃', sect: '飞刃', skill: ['普攻飞刃'] },
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
