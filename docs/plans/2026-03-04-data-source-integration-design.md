# 数据源整合设计文档

**日期**: 2026-03-04  
**主题**: DoubleSkillInfoList.json 与 sectList 数据源整合

---

## 1. 背景与目标

### 当前问题
- `DoubleSkillInfoList.json`（121条双重策略）和 `sectList`（36个流派）是独立数据源
- 存在数据重复和不一致风险
- 需要同步维护两个文件

### 整合目标
- 建立单一数据源（`sectList`）
- 每个流派包含其参与的所有双重策略
- 支持 Tooltip 展示流派相关的完整双重策略信息

---

## 2. 架构设计

### 2.1 数据源架构

```
src/domains/config/constants.ts (sectList - 单一数据源)
       │
       ├── skill[] - 技能列表（名称+触发位）
       │
       └── doubleSkills[] - 该流派参与的双重策略
                ├── name: 策略名称
                ├── partnerSect: 搭档流派
                ├── partnerAttribute: 搭档属性
                ├── trigger: 触发位列表
                └── description: 效果描述
```

### 2.2 类型定义

```typescript
// types.ts 新增接口
export interface DoubleSkill {
  /** 策略名称 */
  name: string;
  /** 搭档流派 */
  partnerSect: SectValue;
  /** 搭档属性 */
  partnerAttribute: Attribute;
  /** 触发位列表 */
  trigger: Trigger[];
  /** 效果描述 */
  description: string;
}

// SectInfo 扩展
export interface SectInfo {
  attribute: Attribute;
  sect: SectValue;
  skill: SectSkill[];
  doubleSkills: DoubleSkill[]; // 新增字段
}
```

---

## 3. 组件设计

### 3.1 数据转换工具

**transformDoubleSkills()** 函数：
- 输入：原始的 `DoubleSkillInfoList.json` 数据
- 处理：按 `mainSect` 和 `secondSect` 分组
- 输出：每个流派的 `DoubleSkill[]` 数组

**转换逻辑**：
1. 遍历所有121条双重策略
2. 对于每条策略，将其添加到 `mainSect` 的 `doubleSkills` 中（partnerSect = secondSect）
3. 同时将其添加到 `secondSect` 的 `doubleSkills` 中（partnerSect = mainSect）
4. 处理属性映射（mainAttribute / secondAttribute）

### 3.2 查询接口

**新增 utils.ts 函数**：
```typescript
/**
 * 获取流派参与的所有双重策略
 * @param sectName - 流派名称
 * @returns 双重策略数组，如果流派不存在返回空数组
 */
export function getDoubleSkillsBySect(sectName: SectValue): DoubleSkill[];
```

---

## 4. 数据流设计

### 4.1 构建时转换流程

```
DoubleSkillInfoList.json (现有数据)
       ↓
transformDoubleSkills() (构建时转换)
       ↓
按 mainSect 和 secondSect 分组
       ↓
sectList 中的每个 SectInfo.doubleSkills[]
```

### 4.2 运行时数据流

```
UI 组件 (Tooltip/技能卡片)
       ↓
getDoubleSkillsBySect(sectName) (utils.ts)
       ↓
直接从 sectList 中读取 doubleSkills
       ↓
展示该流派参与的所有双重策略
```

### 4.3 关键变化

- **移除异步加载**：不再从 `repository.ts` 异步加载 `DoubleSkillInfoList.json`
- **同步访问**：所有双重策略数据内嵌在 `sectList` 中
- **性能提升**：消除异步加载和网络请求开销

---

## 5. 错误处理设计

### 5.1 数据一致性保障

**构建时验证**：
1. 所有 `mainSect` 和 `secondSect` 必须存在于 `sectList` 中
2. 所有 `trigger` 值必须存在于 `triggerList` 中
3. 每个双重策略必须能在两个关联流派中找到

**运行时容错**：
- `getDoubleSkillsBySect()` 返回空数组（而非抛出错误）当流派不存在
- 组件层处理空状态显示（如"暂无双重策略"）

### 5.2 向后兼容策略

- `repository.ts` 保留现有接口，内部改为从 `sectList` 查询
- `DoubleSkillInfoList.json` 可选择保留（自动生成为派生文件）或标记为废弃

---

## 6. 测试设计

### 6.1 数据完整性测试

- 验证所有121条双重策略都已正确分配到对应流派
- 验证每个流派的 `doubleSkills` 数量正确
- 验证双向关系（A-B 策略应在 A 和 B 的 doubleSkills 中都存在）

### 6.2 功能测试

- `getDoubleSkillsBySect('燃烧')` 返回所有包含"燃烧"的双重策略
- 验证返回数据包含完整字段（name, partnerSect, trigger, description）

### 6.3 集成测试

- Tooltip 组件能正确显示双重策略列表
- 筛选功能仍正常工作（使用新数据源）
- TypeScript 编译无错误

---

## 7. 实施计划概述

### 阶段1：类型定义
1. 更新 `domains/config/types.ts`，添加 `DoubleSkill` 接口
2. 更新 `SectInfo` 接口，添加 `doubleSkills` 字段

### 阶段2：数据转换
1. 创建数据转换脚本，将 `DoubleSkillInfoList.json` 转换为 sectList 格式
2. 更新 `constants.ts`，填充 `doubleSkills` 数据

### 阶段3：工具函数
1. 更新 `utils.ts`，添加 `getDoubleSkillsBySect()` 函数
2. 更新 `repository.ts`，适配新的数据结构

### 阶段4：验证
1. 运行 TypeScript 类型检查
2. 验证所有功能正常工作
3. 构建项目确认无错误

---

## 8. YAGNI 决策

**不包含的功能**（遵循 YAGNI 原则）：
- 不添加复杂的缓存机制（数据量小，直接内存访问足够快）
- 不添加数据版本控制（当前无此需求）
- 不添加运行时数据验证（构建时验证足够）
- 不保留双重 JSON 文件（整合后单一数据源足够）

---

**设计完成时间**: 2026-03-04  
**状态**: 已确认，待实施
