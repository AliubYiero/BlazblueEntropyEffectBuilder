# sectConfig 重构设计文档

## 概述

将 `src/config/sectConfig.ts` 从简单的 `{属性: [流派]}` 结构重构为包含详细技能信息的 `SectInfo[]` 结构，并在 UI 的 sect-item 中显示具体的技能名称。

## 目标

- 扩展配置数据结构，包含每个流派对应的具体技能
- sect-combo 中的 sect-item 显示技能列表（如"普攻燃烧/技能燃烧"）
- 保持向后兼容，不破坏现有功能

## 架构

采用"配置中心 + 映射工具"模式：

1. **配置中心** (`sectConfig.ts`)：新 `SectInfo[]` 数组，包含完整的属性-流派-skills 映射
2. **映射工具** (`useSkillData.ts`)：添加 `getSkillsBySect()` 函数，根据流派名获取 skills 字符串
3. **组件层**：sect-item 调用映射工具，将 skills 用 `/` 连接后显示

## 修改文件清单

| 文件 | 修改类型 | 说明 |
|------|----------|------|
| `src/config/sectConfig.ts` | 重构 | 新增 `SectInfo` 接口和 `sectList` 数组 |
| `src/composables/useSkillData.ts` | 新增 | 添加 `getSkillsBySect()` 辅助函数 |
| `src/components/SearchDoublePage/SearchDoubleEffectForm.vue` | 修改 | 更新 sect-item 显示逻辑 |
| `src/components/SectBuilderPage/SelectableSkillCard.vue` | 修改 | 更新 sect-tag 显示逻辑 |

## 数据结构

### SectInfo 接口

```typescript
export interface SectInfo {
  attribute: '火' | '冰' | '电' | '毒' | '暗' | '光' | '刃';
  sect: string;
  skill: string[];
}
```

### sectList 数据

包含 36 个流派，每个流派对应其所属属性和技能列表。

## 数据流

```
sectConfig.ts (SectInfo[])
       ↓
useSkillData.ts (getSkillsBySect)
       ↓
组件模板 ({{ getSkillsBySect(skill.mainSect) }})
```

## 错误处理

1. **流派未找到**：`getSkillsBySect` 回退返回原流派名，避免显示空值
2. **skill 数组为空**：返回空字符串，UI 显示为空白
3. **向后兼容**：保留原 `sectConfig` 对象供其他代码使用，新增 `sectList` 用于技能显示

## UI 变更

### 之前
```
[火] 燃烧 + [刃] 飞剑
```

### 之后
```
[火] 普攻燃烧/技能燃烧/冲刺燃烧 + [刃] 冲刺飞剑
```

## 测试计划

1. **配置数据验证**：启动开发服务器，检查控制台是否有报错
2. **UI 显示验证**：
   - 双重词条筛选页：sect-item 显示 skills 而非流派名
   - 流派构建页：可激活双重策略列表正确显示
3. **边界验证**：检查带括号的流派名（如"寒冷 (寒气爆发)"）是否正确匹配
4. **回归验证**：筛选、选择流派等原有功能正常

## 约束

- 不修改 `SkillInfoInterface` 接口
- 不修改 `SkillInfoList.json` 数据
- 保持 Vue 组件的其他逻辑不变
