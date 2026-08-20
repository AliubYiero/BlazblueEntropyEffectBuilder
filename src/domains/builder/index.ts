/**
 * Builder Domain Module
 * @description 构建域统一导出 - 技能位配置管理和策略计算
 */

// Types
export type {
  SkillCardInfo,
  SkillCardInfoTuple,
  ActivatedSkillResult,
  DuplicateCheckResult,
  SlotAssignment,
} from './types.ts';

// Store
export { useBuilderStore } from './store.ts';

// Services
export {
  calculateActivatedSkills,
  calculateSlotAssignments,
  checkDuplicateSect,
  getAvailableTriggersForSect,
  isValidSectTriggerCombination,
  getSectConflicts,
} from './service.ts';
