# 性能优化与代码重构实施计划

>
*
*For
Claude:
** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

*
*Goal:
** 通过重构 Store 架构、优化响应式性能、清理废弃代码、增强表单验证，提升应用性能和可维护性

*
*Architecture:
** 创建独立的
`useSkillData` composable 管理数据加载，
`useSectValidation` 管理验证逻辑，Store 只保留状态管理，使用
`shallowRef` 替代
`reactive` 优化性能

*
*Tech
Stack:
** Vue 3, Pinia, Element Plus, TypeScript, Vitest

---

## 前置检查

### 检查 1: 确认项目环境

*
*命令:
**

```bash
cd D:\Code\.project\3_blazblue_entropy_effect_builder
pnpm --version
```

*
*预期:
** 显示 pnpm 版本号

---

## 阶段一: 核心 Composables 开发

### Task 1: 创建 useSkillData.ts

*
*Files:
**

- Create:
  `src/composables/useSkillData.ts`

*
*实现内容:
**

- 动态导入
  `SkillInfoList.json`
- 使用
  `Object.freeze()` 冻结数据
- 使用
  `shallowRef` 存储数据
- 计算派生数据（sectMapper、triggerInfoList）
- 提供查询方法

*
*代码:
**

```typescript
import {
	shallowRef,
	computed,
	readonly,
	type Ref
} from 'vue';
import type {
	SkillInfoInterface
} from '../interfaces/SkillInfoInterface.ts';
import type {
	SectValue
} from '../interfaces/SectValue.ts';
import type {
	Attribute
} from '../interfaces/Attribute.ts';
import type {
	Trigger
} from '../interfaces/Trigger.ts';
import {
	sectConfig
} from '../config/sectConfig.ts';

interface TriggerInfo {
	name: SectValue;
	trigger: Trigger[];
}

let isInitialized = false;
const rawSkillData = shallowRef<Readonly<SkillInfoInterface[]>>( [] );

export const useSkillData = () => {
	if ( !isInitialized ) {
		initializeData();
	}
	
	const skillInfoList = readonly( rawSkillData ) as Readonly<Ref<Readonly<SkillInfoInterface[]>>>;
	
	const sectMapper = computed( () => {
		const mapper = new Map<SectValue, Attribute>();
		Object.entries( sectConfig ).forEach( ( [ attribute, sects ] ) => {
			sects.forEach( ( sect ) => {
				mapper.set( sect as SectValue, attribute as Attribute );
			} );
		} );
		return mapper;
	} );
	
	const triggerInfoList = computed<Readonly<TriggerInfo[]>>( () => {
		const sectTriggers = new Map<SectValue, Set<Trigger>>();
		
		rawSkillData.value.forEach( ( skill ) => {
			[ skill.mainSect, skill.secondSect ].forEach( ( sect ) => {
				if ( !sectTriggers.has( sect ) ) {
					sectTriggers.set( sect, new Set() );
				}
				skill.trigger.forEach( ( t ) => sectTriggers.get( sect )?.add( t ) );
			} );
		} );
		
		return Object.freeze(
			Array.from( sectTriggers.entries() ).map( ( [ name, triggers ] ) => ( {
				name,
				trigger: Array.from( triggers ),
			} ) )
		);
	} );
	
	const getAttributeBySect = ( sect: SectValue ): Attribute | undefined => {
		return sectMapper.value.get( sect );
	};
	
	const getValidTriggersForSect = ( sect: SectValue ): Trigger[] => {
		const info = triggerInfoList.value.find( ( t ) => t.name === sect );
		return info ? info.trigger : [];
	};
	
	const isValidSect = ( sect: SectValue ): boolean => {
		return sectMapper.value.has( sect );
	};
	
	return {
		skillInfoList,
		triggerInfoList,
		sectMapper,
		getAttributeBySect,
		getValidTriggersForSect,
		isValidSect,
	};
};

const initializeData = async () => {
	try {
		const data = await import('../data/DoubleSkillInfoList.json');
		const frozenData = Object.freeze( [ ...data.default ] ) as Readonly<SkillInfoInterface[]>;
		rawSkillData.value = frozenData;
		isInitialized = true;
	}
	catch ( error ) {
		console.error( '[useSkillData] 数据加载失败:', error );
		rawSkillData.value = Object.freeze( [] ) as Readonly<SkillInfoInterface[]>;
		isInitialized = true;
	}
};
```

*
*验证步骤:
**

```bash
cd D:\Code\.project\3_blazblue_entropy_effect_builder
pnpm build
```

*
*预期:
** 构建成功，无类型错误

*
*提交:
**

```bash
git add src/composables/useSkillData.ts
git commit -m "feat: add useSkillData composable for optimized data loading"
```

---

### Task 2: 创建 useSectValidation.ts

*
*Files:
**

- Create:
  `src/composables/useSectValidation.ts`
- Reference:
  `src/store/useSkillCardInfoStore.ts`

*
*实现内容:
**

- 接收 triggerName 参数
- 提供 Element Plus 表单验证规则
- 实现三种验证器：流派-触发位匹配、流派-属性匹配、重复流派

*
*代码:
**

```typescript
import type { FormRules } from 'element-plus';
import { useSkillData } from './useSkillData.ts';
import { useSkillCardInfoStore } from '../store/useSkillCardInfoStore.ts';
import type { Trigger } from '../interfaces/Trigger.ts';
import type { SectValue } from '../interfaces/SectValue.ts';
import type { Attribute } from '../interfaces/Attribute.ts';

interface FormData {
  sect: SectValue | '';
  attribute: Attribute | '';
}

export const useSectValidation = (triggerName: Trigger) => {
  const skillData = useSkillData();
  const skillCardStore = useSkillCardInfoStore();

  const rules: FormRules<FormData> = {
    sect: [
      { required: true, message: '请选择流派', trigger: 'change' },
      { validator: validateSectTriggerMatch, trigger: 'change' },
      { validator: validateDuplicateSect, trigger: 'change' },
    ],
  };

  function validateSectTriggerMatch(
    _rule: unknown,
    value: SectValue | '',
    callback: (error?: Error) => void
  ) {
    if (!value) {
      callback();
      return;
    }

    const validTriggers = skillData.getValidTriggersForSect(value);
    if (!validTriggers.includes(triggerName)) {
      callback(new Error(`该流派无法在【${triggerName}】位使用`));
    } else {
      callback();
    }
  }

  function validateDuplicateSect(
    _rule: unknown,
    value: SectValue | '',
    callback: (error?: Error) => void
  ) {
    if (!value) {
      callback();
      return;
    }

    const existingCard = skillCardStore.skillCardInfoList.find(
      (card) => card.sect === value && card.triggerName !== triggerName
    );

    if (existingCard) {
      callback(
        new Error(`该流派已在【${existingCard.triggerName}】位配置`)
      );
    } else {
      callback();
    }
  }

  const validateAttributeMatch = (
    sect: SectValue | '',
    attribute: Attribute | ''
  ): boolean => {
    if (!sect || !attribute) return true;
    const actualAttribute = skillData.getAttributeBySect(sect);
    return actualAttribute === attribute;
  };

  return {
    rules,
    validateAttributeMatch,
  };
};
```

*
*验证步骤:
**

```bash
pnpm build
```

*
*预期:
** 构建成功

*
*提交:
**

```bash
git add src/composables/useSectValidation.ts
git commit -m "feat: add useSectValidation composable for form validation"
```

---

## 阶段二: Store 重构

### Task 3: 重构 useSkillInfoStore.ts

*
*Files:
**

- Modify:
  `src/store/useSkillInfoStore.ts`
- Reference:
  `src/composables/useSkillData.ts`

*
*变更内容:
**

- 删除硬编码的
  `skillInfoList`
- 删除硬编码的
  `triggerInfoList`
- 删除
  `createSkillInfo` 函数
- 使用
  `useSkillData` 获取数据
- 保留筛选方法但使用计算属性优化

*
*代码:
**

```typescript
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useSkillData } from '../composables/useSkillData.ts';
import type { Attribute } from '../interfaces/Attribute.ts';
import type { SectValue } from '../interfaces/SectValue.ts';
import type { Trigger } from '../interfaces/Trigger.ts';

export const useSkillInfoStore = defineStore('skillInfo', () => {
  const skillData = useSkillData();

  const skillInfoList = skillData.skillInfoList;
  const triggerInfoList = skillData.triggerInfoList;

  const filterSkillsByAttribute = (attribute: Attribute) => {
    return computed(() =>
      skillInfoList.value.filter(
        (skill) =>
          skill.mainAttribute === attribute || skill.secondAttribute === attribute
      )
    );
  };

  const filterSkillsBySect = (sect: SectValue) => {
    return computed(() =>
      skillInfoList.value.filter(
        (skill) => skill.mainSect === sect || skill.secondSect === sect
      )
    );
  };

  const filterSkillsByTrigger = (trigger: Trigger) => {
    return computed(() =>
      skillInfoList.value.filter((skill) => skill.trigger.includes(trigger))
    );
  };

  return {
    skillInfoList,
    triggerInfoList,
    filterSkillsByAttribute,
    filterSkillsBySect,
    filterSkillsByTrigger,
  };
});
```

*
*验证步骤:
**

```bash
pnpm build
```

*
*预期:
** 构建成功，无剩余引用错误

*
*提交:
**

```bash
git add src/store/useSkillInfoStore.ts
git commit -m "refactor: useSkillInfoStore use useSkillData, remove hardcoded data"
```

---

### Task 4: 优化 useSkillCardInfoStore.ts

*
*Files:
**

- Modify:
  `src/store/useSkillCardInfoStore.ts`

*
*变更内容:
**

-
`reactive` 改为
`shallowRef`
- 更新方法改为返回新数组引用

*
*代码:
**

```typescript
import { defineStore } from 'pinia';
import { shallowRef, readonly } from 'vue';
import type { SkillCardInfoTuple } from '../interfaces/SkillCardInfoTuple.ts';
import type { Trigger } from '../interfaces/Trigger.ts';
import type { SectValue } from '../interfaces/SectValue.ts';

export const useSkillCardInfoStore = defineStore('skillCardInfo', () => {
  const skillCardInfoList = shallowRef<SkillCardInfoTuple>([
    { triggerName: '普攻', sect: '', inherit: false },
    { triggerName: '技能', sect: '', inherit: false },
    { triggerName: '冲刺', sect: '', inherit: false },
    { triggerName: '传承', sect: '', inherit: false },
    { triggerName: '召唤', sect: '', inherit: false },
  ]);

  const updateSkillCardInfoInherit = (
    triggerName: Trigger,
    inherit: boolean
  ) => {
    const newList: SkillCardInfoTuple = skillCardInfoList.value.map((item) =>
      item.triggerName === triggerName ? { ...item, inherit } : item
    ) as SkillCardInfoTuple;
    skillCardInfoList.value = newList;
  };

  const updateSkillCardInfo = (triggerName: Trigger, sect: SectValue) => {
    const validTriggers: Trigger[] = ['普攻', '技能', '冲刺', '传承', '召唤'];
    if (!validTriggers.includes(triggerName)) {
      console.warn(`[useSkillCardInfoStore] 无效的触发位: ${triggerName}`);
      return;
    }

    const newList: SkillCardInfoTuple = skillCardInfoList.value.map((item) =>
      item.triggerName === triggerName ? { ...item, sect } : item
    ) as SkillCardInfoTuple;
    skillCardInfoList.value = newList;
  };

  return {
    skillCardInfoList: readonly(skillCardInfoList),
    updateSkillCardInfoInherit,
    updateSkillCardInfo,
  };
});
```

*
*验证步骤:
**

```bash
pnpm build
```

*
*预期:
** 构建成功

*
*提交:
**

```bash
git add src/store/useSkillCardInfoStore.ts
git commit -m "perf: use shallowRef in useSkillCardInfoStore for better performance"
```

---

## 阶段三: 组件更新

### Task 5: 更新 ChangeSkillSectForm.vue

*
*Files:
**

- Modify:
  `src/components/SectBuilderPage/ChangeSkillSectForm.vue`
- Reference:
  `src/composables/useSectValidation.ts`

*
*变更内容:
**

- 引入
  `useSectValidation`
- 移除硬编码的验证规则，使用 composable 提供的规则
- 属性选择时自动验证匹配性

*
*代码:
**

```vue
<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../interfaces/SectValue.ts';
import { sectConfig } from '../../config/sectConfig.ts';
import { useSkillData } from '../../composables/useSkillData.ts';
import { useSkillCardInfoStore } from '../../store/useSkillCardInfoStore.ts';
import { useSectValidation } from '../../composables/useSectValidation.ts';
import type { FormInstance } from 'element-plus';

const props = defineProps<{ triggerName: Trigger }>();
const emit = defineEmits<{ (event: 'closeDialog'): void }>();

const skillData = useSkillData();
const skillCardInfoStore = useSkillCardInfoStore();
const { rules, validateAttributeMatch } = useSectValidation(props.triggerName);

const formData = reactive({
  triggerName: props.triggerName,
  attribute: '' as Attribute | '',
  sect: '' as SectValue | '',
});

const formRef = ref<FormInstance>();
const attributeList = Object.keys(sectConfig) as Attribute[];

watch(
  () => formData.sect,
  (val) => {
    if (val) {
      const actualAttr = skillData.getAttributeBySect(val);
      if (actualAttr && actualAttr !== formData.attribute) {
        formData.attribute = actualAttr;
      }
    }
  }
);

watch(
  () => formData.attribute,
  (val) => {
    if (val && formData.sect) {
      const isMatch = validateAttributeMatch(formData.sect, val);
      if (!isMatch) {
        formData.sect = '';
      }
    }
  }
);

const filterSectList = computed(() => {
  const available = skillData.triggerInfoList.value.filter((t) =>
    t.trigger.includes(props.triggerName)
  );
  const all: { name: SectValue; attribute: Attribute }[] = [];
  for (const attr of attributeList) {
    sectConfig[attr].forEach((sect) => {
      if (available.find((t) => t.name === sect)) {
        all.push({ name: sect as SectValue, attribute: attr });
      }
    });
  }
  return formData.attribute
    ? all.filter((s) => s.attribute === formData.attribute)
    : all;
});

const fetchSectListSuggestions = (search: string, cb: Function) => {
  const list = filterSectList.value.map((s) => ({ value: s.name }));
  cb(search ? list.filter((s) => s.value.includes(search)) : list);
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid && formData.sect) {
      skillCardInfoStore.updateSkillCardInfo(props.triggerName, formData.sect);
      handleCancel();
    }
  });
};

const handleCancel = () => {
  formData.sect = '';
  formData.attribute = '';
  emit('closeDialog');
};

const styleMapper: Record<Attribute, string> = {
  火: 'fire',
  冰: 'ice',
  电: 'thunder',
  毒: 'poison',
  暗: 'dark',
  光: 'light',
  刃: 'blade',
};
</script>
```

*
*验证步骤:
**

```bash
pnpm build
```

*
*预期:
** 构建成功

*
*提交:
**

```bash
git add src/components/SectBuilderPage/ChangeSkillSectForm.vue
git commit -m "feat: enhance ChangeSkillSectForm with useSectValidation"
```

---

## 阶段四: 组件清理

### Task 6: 删除废弃组件 EnabledDoubleSkill.vue

*
*Files:
**

- Delete:
  `src/components/SectBuilderPage/EnabledDoubleSkill.vue`
- Modify:
  `docs/plans/PROJECT_ARCHITECTURE.md`
- Modify:
  `AGENTS.md`

*
*步骤
1:
删除文件
**

*
*命令:
**

```bash
cd D:\Code\.project\3_blazblue_entropy_effect_builder
del "src\components\SectBuilderPage\EnabledDoubleSkill.vue"
```

*
*步骤
2:
更新
PROJECT_ARCHITECTURE.md
**

将文档中关于 EnabledDoubleSkill.vue 的描述改为：

```
- [已删除] EnabledDoubleSkill.vue - 功能已整合到 SectBuilderPage.vue
```

*
*步骤
3:
更新
AGENTS.md
**

将文档中关于 EnabledDoubleSkill.vue 的描述改为：

```
- EnabledDoubleSkill.vue - [已删除] 功能已整合到 SectBuilderPage.vue
```

*
*验证步骤:
**

```bash
grep -r "EnabledDoubleSkill" src/ || echo "No references found"
```

*
*预期:
** 无引用（grep 命令可能不可用，手动检查确保无导入）

*
*提交:
**

```bash
git add -A
git commit -m "chore: remove deprecated EnabledDoubleSkill component"
```

---

## 阶段五: 验证与测试

### Task 7: 类型检查

*
*命令:
**

```bash
cd D:\Code\.project\3_blazblue_entropy_effect_builder
pnpm vue-tsc --noEmit
```

*
*预期:
** 无类型错误

---

### Task 8: 构建测试

*
*命令:
**

```bash
pnpm build
```

*
*预期:
** 构建成功，无警告

---

### Task 9: 手动功能测试

*
*测试清单:
**

- [ ] 启动开发服务器
  `pnpm dev`
- [ ] 访问双重词条筛选页，数据正确加载（显示73条）
- [ ] 属性筛选功能正常
- [ ] 流派筛选功能正常
- [ ] 访问流派构建页
- [ ] 点击技能卡片打开对话框
- [ ] 选择流派时触发验证
- [ ] 选择不匹配触发位的流派显示错误
- [ ] 选择已配置的流派显示重复错误
- [ ] 确认后流派正确保存
- [ ] 已激活策略列表正确更新

---

### Task 10: 性能验证

*
*验证点:
**

1. 控制台无
   `reactive` 深度代理警告
2. 应用启动时间正常
3. 筛选操作响应流畅

---

## 最终提交

```bash
git add -A
git commit -m "perf: optimize store performance and enhance form validation

- Add useSkillData composable for optimized data loading with Object.freeze()
- Add useSectValidation composable for comprehensive form validation
- Refactor useSkillInfoStore to remove hardcoded data
- Optimize useSkillCardInfoStore with shallowRef
- Enhance ChangeSkillSectForm with trigger/attribute validation
- Remove deprecated EnabledDoubleSkill component
- Update documentation"
```

---

## 回滚方案

如遇到问题，分步回滚:

```bash
# 回滚到 Task 6 之前
git reset --hard HEAD~1

# 回滚到 Task 4 之前
git reset --hard HEAD~3

# 完全回滚到初始状态
git reset --hard HEAD~6
```

---

*
*计划完成，准备实施。
**
