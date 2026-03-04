// src/domains/config/index.ts
/**
 * Config Domain Module
 * @description 配置域统一导出 - 流派、属性、触发位相关类型和函数
 */

// Types
export type { SectInfo, SectConfigMap, AttributeList, TriggerList } from './types.ts';

// Constants
export { sectList, attributeList, triggerList, sectConfig } from './constants.ts';

// Utils
export {
  getSkillsBySect,
  getAttributeBySect,
  getSectsByAttribute,
  isValidSect,
  getAllSectNames,
  getSectInfo,
} from './utils.ts';
