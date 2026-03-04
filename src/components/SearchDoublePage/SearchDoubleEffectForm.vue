<style lang="scss" scoped>
.page-container {
	min-height: calc(100vh - 60px);
	padding: 24px;
	max-width: 1280px;
	margin: 0 auto;
}

.filter-section {
	margin-bottom: 32px;
}

.filter-card {
	background: hsl(var(--card));
	border: 1px solid hsl(var(--border));
	border-radius: var(--radius);
	padding: 24px;
}

.filter-title {
	font-family: var(--font-chinese);
	font-size: 14px;
	font-weight: 600;
	color: hsl(var(--foreground));
	margin-bottom: 16px;
}

.input-row {
	display: flex;
	gap: 16px;
	margin-bottom: 16px;
	flex-wrap: wrap;
}

.input-group {
	flex: 1;
	min-width: 200px;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.input-label {
	font-family: var(--font-chinese);
	font-size: 12px;
	font-weight: 500;
	color: hsl(var(--muted-foreground));
}

.checkbox-section {
	padding-top: 16px;
	border-top: 1px solid hsl(var(--border));
}

.checkbox-row {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;

	&:not(:last-child) {
		margin-bottom: 8px;
	}
}

.checkbox-label {
	font-family: var(--font-chinese);
	font-size: 12px;
	font-weight: 500;
	color: hsl(var(--muted-foreground));
	min-width: 40px;
}

.results-header {
	margin-bottom: 16px;
}

.results-count {
	font-family: var(--font-chinese);
	font-size: 14px;
	color: hsl(var(--muted-foreground));

	.count-number {
		font-weight: 600;
		color: hsl(var(--foreground));
	}
}

.skills-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	gap: 16px;
}

.skill-card {
	background: hsl(var(--card));
	border: 1px solid hsl(var(--border));
	border-radius: var(--radius);
	padding: 16px;
	transition: all 0.15s ease;

	&:hover {
		border-color: hsl(var(--ring));
		background: hsl(var(--accent) / 0.3);
	}
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12px;
}

.skill-name {
	font-family: var(--font-chinese);
	font-size: 14px;
	font-weight: 600;
	color: hsl(var(--foreground));
}

.trigger-badges {
	display: flex;
	gap: 4px;
}

.trigger-badge {
	font-family: var(--font-chinese);
	font-size: 11px;
	font-weight: 500;
	padding: 2px 8px;
	border-radius: calc(var(--radius) - 4px);
	background: hsl(var(--secondary));
	color: hsl(var(--secondary-foreground));
}

.sect-combo {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
}

.sect-item {
	display: flex;
	align-items: center;
	gap: 4px;
}

.sect-name {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 500;
	color: hsl(var(--foreground));
}

.sect-connector {
	color: hsl(var(--muted-foreground));
	font-size: 12px;
}

.skill-description {
	font-family: var(--font-chinese);
	font-size: 13px;
	line-height: 1.5;
	color: hsl(var(--muted-foreground));
	padding-top: 8px;
	border-top: 1px solid hsl(var(--border));
}

.empty-state {
	grid-column: 1 / -1;
	text-align: center;
	padding: 48px;
	color: hsl(var(--muted-foreground));
}

@media (max-width: 768px) {
	.page-container {
		padding: 16px;
	}

	.skills-grid {
		grid-template-columns: 1fr;
	}
}
</style>

<template>
	<div class="page-container">
		<section class="filter-section">
			<div class="filter-card">
				<div class="filter-title">筛选条件</div>

				<div class="input-row">
					<div class="input-group">
						<label class="input-label">属性</label>
						<el-autocomplete
							v-model="attribute"
							:fetch-suggestions="handleFetchAttributeSuggestions"
							placeholder="选择或输入属性"
							clearable
						/>
					</div>

					<div class="input-group">
						<label class="input-label">流派</label>
						<el-autocomplete
							v-model="sect"
							:fetch-suggestions="handleFetchSectSuggestions"
							placeholder="选择或输入流派"
							clearable
						/>
					</div>
				</div>

				<div class="checkbox-section">
					<div class="checkbox-row">
						<span class="checkbox-label">流派</span>
						<el-checkbox
							v-for="item in sectCheckboxItems"
							:key="item.key"
							:model-value="item.value"
							:label="item.label"
							@change="(val: boolean) => handleSectCheckboxChange(item.key, val)"
						/>
					</div>

					<div class="checkbox-row">
						<span class="checkbox-label">槽位</span>
						<el-checkbox
							v-for="item in triggerCheckboxItems"
							:key="item.key"
							:model-value="item.value"
							:label="item.label"
							@change="(val: boolean) => handleTriggerCheckboxChange(item.key, val)"
						/>
					</div>
				</div>
			</div>
		</section>

		<div class="results-header">
			<div class="results-count">
				<span class="count-number">{{ filterSkillInfoList.length }}</span> 条双重策略
			</div>
		</div>

		<div class="skills-grid">
			<div v-if="filterSkillInfoList.length === 0" class="empty-state">
				没有找到匹配的双重策略
			</div>

			<div
				v-for="skill in filterSkillInfoList"
				:key="skill.name"
				class="skill-card"
			>
				<div class="card-header">
					<h3 class="skill-name">{{ skill.name }}</h3>
					<div class="trigger-badges">
						<span v-for="trigger in skill.trigger" :key="trigger" class="trigger-badge">{{ trigger }}</span>
					</div>
				</div>

				<div class="sect-combo">
					<div class="sect-item">
						<span :class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
						<template v-if="getSkillDisplay(skill.mainSect)">
							<el-tooltip :content="getSkillDisplay(skill.mainSect)" placement="top">
								<span class="sect-name">{{ skill.mainSect }}</span>
							</el-tooltip>
						</template>
						<template v-else>
							<span class="sect-name">{{ skill.mainSect }}</span>
						</template>
					</div>

					<span class="sect-connector">+</span>

					<div class="sect-item">
						<span :class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"></span>
						<template v-if="getSkillDisplay(skill.secondSect)">
							<el-tooltip :content="getSkillDisplay(skill.secondSect)" placement="top">
								<span class="sect-name">{{ skill.secondSect }}</span>
							</el-tooltip>
						</template>
						<template v-else>
							<span class="sect-name">{{ skill.secondSect }}</span>
						</template>
					</div>
				</div>

				<p class="skill-description">{{ skill.description }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useFilterStore, getAttributeSuggestions, getSectSuggestions } from '../../domains/filter/index.ts';
import { getSkillInfoList } from '../../domains/skill/repository.ts';
import { sectConfig, getSkillsBySect } from '../../domains/config/index.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';

// 初始化 Store
const filterStore = useFilterStore();
const skillInfoList = getSkillInfoList();

// 双向绑定的筛选状态
const attribute = computed({
	get: () => filterStore.attribute,
	set: (val) => filterStore.setAttribute(val),
});

const sect = computed({
	get: () => filterStore.sect,
	set: (val) => filterStore.setSect(val),
});

// 复选框状态 - 转换为数组形式用于模板渲染
const sectCheckboxItems = computed(() => [
	{ key: 'main' as const, label: '主流派', value: filterStore.sectCheckboxes.main },
	{ key: 'second' as const, label: '副流派', value: filterStore.sectCheckboxes.second },
]);

const triggerCheckboxItems = computed(() => [
	{ key: '普攻' as const, label: '普攻', value: filterStore.triggerCheckboxes.普攻 },
	{ key: '技能' as const, label: '技能', value: filterStore.triggerCheckboxes.技能 },
	{ key: '冲刺' as const, label: '冲刺', value: filterStore.triggerCheckboxes.冲刺 },
	{ key: '召唤' as const, label: '召唤', value: filterStore.triggerCheckboxes.召唤 },
	{ key: '传承' as const, label: '传承', value: filterStore.triggerCheckboxes.传承 },
]);

// 复选框切换处理
const handleSectCheckboxChange = (key: 'main' | 'second', value: boolean) => {
	filterStore.toggleSectCheckbox(key, value);
};

const handleTriggerCheckboxChange = (key: Trigger, value: boolean) => {
	filterStore.toggleTriggerCheckbox(key, value);
};

// 自动完成建议
const handleFetchAttributeSuggestions = (searchString: string, cb: Function) => {
	const list = getAttributeSuggestions(skillInfoList.value, searchString);
	cb(list);
};

const handleFetchSectSuggestions = (searchString: string, cb: Function) => {
	const list = getSectSuggestions(skillInfoList.value, attribute.value, searchString, sectConfig);
	cb(list);
};

// 筛选结果
const filterSkillInfoList = computed(() => filterStore.filterResult.skills);

// 样式映射
const styleMapper: Record<Attribute, string> = {
	'火': 'fire', '冰': 'ice', '电': 'thunder',
	'毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};

// 流派技能提示
const getSkillDisplay = (sectName: string): string => {
	return getSkillsBySect(sectName);
};
</script>
