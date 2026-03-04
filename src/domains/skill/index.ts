/**
 * Skill Domain Module
 * @description 技能域统一导出 - 数据加载、查询和筛选
 */

// Types
export type { TriggerInfo, SkillFilter, SectAttributeMap } from './types.ts';

// Repository
export {
  // 初始化和数据获取
  initializeRepository,
  getSkillInfoList,
  getSectAttributeMap,
  getTriggerInfoList,
  // 筛选功能
  filterByAttribute,
  filterBySect,
  filterByTrigger,
  filterSkills,
  // 查询和验证
  getValidTriggersForSect,
  isValidSect,
  getAttributeBySectValue,
  // 测试用
  resetRepository,
} from './repository.ts';
