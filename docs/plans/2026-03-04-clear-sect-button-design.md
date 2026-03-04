# 流派清除按钮设计文档

## 背景

为技能流派卡片添加清除按钮功能，允许用户快速清除已选择的流派。

## 目标

- 在已选择流派的卡片上显示清除按钮
- 一键清除当前技能位的流派配置
- 保持界面简洁，无选择时不显示按钮

## 方案选择

采用**方案 A（卡片内清除按钮）**：
- 在 SkillCard 组件右上角添加清除图标
- 只在有流派选择时显示
- 操作路径最短，用户体验最佳

## 架构设计

修改范围：`src/components/SectBuilderPage/SkillCard.vue` 单组件

依赖：
- `useBuilderStore` - 调用 `updateSkillCardInfo` 方法清除流派
- Element Plus 图标 - 使用 `CircleClose` 或 `Close` 图标

数据流：
```
用户点击清除按钮 → handleClear() → updateSkillCardInfo(triggerName, '') 
→ skillCardInfoList 更新 → UI 刷新
```

## 组件设计

### 模板部分

- 在卡片容器内添加清除按钮（绝对定位右上角）
- 使用 `v-if="skillCardInfo.sect"` 控制显示/隐藏
- 按钮使用 `@click.stop` 阻止事件冒泡

### 脚本部分

- 导入 `useBuilderStore`
- 新增 `handleClear` 方法：
  ```typescript
  const handleClear = () => {
    builderStore.updateSkillCardInfo(props.skillCardInfo.triggerName, '');
  };
  ```

### 样式部分

- 按钮定位：`position: absolute; top: 8px; right: 8px;`
- 默认透明度：`opacity: 0.6`，hover 时 `opacity: 1`
- 按钮大小：20px，圆形
- 颜色：红色系提示删除操作

## 数据流设计

现有数据流保持不变：
- `skillCardInfo` 作为 prop 传入
- `updateSkillCardInfo` 更新 Store 状态
- `shallowRef` 触发响应式更新

新增交互：
- 清除按钮点击 → 调用 Store 方法 → 状态更新 → 按钮自动隐藏

## 错误处理

边界情况：
1. 未选择流派 → 按钮不显示
2. 连续点击 → 第一次后按钮消失，防止重复
3. 事件冒泡 → 使用 `.stop` 修饰符阻止
4. Store 失败 → 已在 Store 层处理 warn 日志

## 测试场景

### 手动测试

| 场景 | 预期结果 |
|------|----------|
| 选择流派后 | 清除按钮显示在卡片右上角 |
| 点击清除按钮 | 流派被清除，显示"点击选择" |
| 点击清除按钮 | 不打开选择对话框 |
| 未选择流派 | 清除按钮不显示 |
| 清除后 | 已激活策略列表自动更新 |

### 边界测试

- 快速连续点击：只执行一次
- 移动端触摸：按钮大小适合点击

## 实现文件

- `src/components/SectBuilderPage/SkillCard.vue`
