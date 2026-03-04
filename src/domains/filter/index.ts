/**
 * Filter Domain
 * @description 筛选域模块 - 管理双重词条筛选的状态和逻辑
 *
 * @module domains/filter
 * @example
 * ```ts
 * import { useFilterStore, applyFilter, getAttributeSuggestions } from '@/domains/filter';
 *
 * // 在组件中使用 Store
 * const filterStore = useFilterStore();
 * filterStore.setAttribute('火');
 * const results = filterStore.filterResult;
 *
 * // 或使用纯函数
 * const filtered = applyFilter(skills, filterState);
 * ```
 */

// Types
export type {
  FilterState,
  FilterResult,
  SectCheckboxState,
  TriggerCheckboxState,
  ReadOnlyFilterState,
  AutocompleteSuggestion,
} from './types.ts';

// Store
export { useFilterStore } from './store.ts';

// Service
export {
  applyFilter,
  getAttributeSuggestions,
  getSectSuggestions,
  isFilterEmpty,
  areAllTriggersSelected,
  areAllSectsSelected,
} from './service.ts';
