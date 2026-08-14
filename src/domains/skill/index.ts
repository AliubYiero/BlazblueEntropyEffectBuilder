/**
 * Skill Domain Module
 * @description 技能域统一导出 - V2 索引加载与查询
 */

// Repository
export {
  // 初始化和数据获取
  initializeRepository,
  getSkillIndex,
  // 查询
  getStrategyById,
  getStrategySectPair,
  // 测试用
  resetRepository,
} from './repository.ts';
