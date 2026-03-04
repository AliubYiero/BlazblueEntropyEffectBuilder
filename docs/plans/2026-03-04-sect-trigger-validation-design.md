# 流派触发位验证设计文档

## 背景

修改技能流派对话框，如果关联双重策略中的流派不属于当前触发位，则无法选择。通过 `src/domains/config/constants.ts` 中的 `skill.trigger` 可以判断流派支持的触发位。

## 目标

- 在用户界面上直观显示哪些流派可以在当前触发位使用
- 禁用不可用的流派选项，避免用户误选
- 保持信息完整性，用户仍能看到所有关联的双重策略

## 方案选择

采用**方案 B（禁用标签）**：
- 显示所有占用当前触发位的双重策略
- 对于策略中的两个流派，分别判断是否支持当前触发位
- 不支持的流派显示为禁用态，并有 tooltip 提示

## 架构设计

修改范围：`src/components/SectBuilderPage/ChangeSkillSectForm.vue` 单组件

新增依赖：
- 从 `domains/skill/repository` 引入 `getValidTriggersForSect`

数据流：
```
getValidTriggersForSect(sect) → 获取流派支持的触发位列表
                            ↓
isSectAvailableForTrigger(sect, trigger) → 判断是否可用
                            ↓
el-tag :disabled="!isAvailable" → UI 禁用态
```

## 组件设计

### 脚本部分改动

1. 引入 `getValidTriggersForSect` 函数
2. 新增辅助函数 `isSectAvailableForTrigger(sect, trigger)`
3. `selectSect` 函数增加可用性前置检查

### 模板部分改动

1. 为每个 `el-tag` 添加动态 `:disabled` 属性
2. 使用 Element Plus 的 `el-tooltip` 包裹禁用的标签
3. 添加 `.is-disabled` CSS 类

### 样式部分改动

```scss
.sect-tag.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: hsl(var(--secondary) / 0.5);
  
  &:hover {
    transform: none;
  }
}
```

## 数据流设计

现有数据流保持不变，新增实时可用性判断：

- 渲染时调用 `getValidTriggersForSect(sect)` 获取支持列表
- 使用 `Array.includes()` 判断是否包含当前触发位
- 计算属性缓存结果，性能可忽略（O(1) Map 查找）

## 错误处理

边界情况：
1. 流派未在双重策略中定义 → `getValidTriggersForSect` 返回空数组 → 标记不可用
2. 数据未加载完成 → 默认启用，避免误伤
3. 点击已禁用标签 → 函数内检查，直接返回无操作
4. 表单提交 → 保持现有 `validateSect` 验证作为最后防线

## 测试场景

### 手动测试

| 场景 | 预期结果 |
|------|----------|
| 普攻位选择 | "火精灵"可点击，"火弹"禁用态 |
| 禁用标签样式 | 透明度降低、无hover动画、tooltip提示 |
| 点击禁用标签 | 无任何反应 |
| 正常选择流程 | 正常更新配置 |
| 属性筛选后 | 可用/不可用状态正确 |

### 边界测试

- 数据加载前打开对话框：标签全部可点击
- 全禁用场景：两个流派都不支持，两个标签都禁用

## 实现文件

- `src/components/SectBuilderPage/ChangeSkillSectForm.vue`
