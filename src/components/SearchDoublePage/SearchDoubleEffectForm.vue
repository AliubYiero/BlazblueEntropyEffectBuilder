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
							clearable
							placeholder="选择或输入属性"
						/>
					</div>
					
					<div class="input-group">
						<label class="input-label">流派</label>
						<el-autocomplete
							v-model="sect"
							:fetch-suggestions="handleFetchSectSuggestions"
							clearable
							placeholder="选择或输入流派"
						/>
					</div>
				</div>
				
				<div class="checkbox-section">
					<div class="checkbox-row">
						<span class="checkbox-label">流派</span>
						<el-checkbox
							v-for="item in sectCheckboxItems"
							:key="item.key"
							:label="item.label"
							:model-value="item.value"
							@change="(val: boolean) => handleSectCheckboxChange(item.key, val)"
						/>
					</div>
					
					<div class="checkbox-row">
						<span class="checkbox-label">槽位</span>
						<el-checkbox
							v-for="item in triggerCheckboxItems"
							:key="item.key"
							:label="item.label"
							:model-value="item.value"
							@change="(val: boolean) => handleTriggerCheckboxChange(item.key, val)"
						/>
					</div>
				</div>
			</div>
		</section>
		
		<div class="results-header">
			<div class="results-count">
				<span class="count-number">{{
						filterSkillInfoList.length
					}}</span>
				条双重策略
			</div>
		</div>
		
		<div class="skills-grid">
			<div v-if="filterSkillInfoList.length === 0" class="empty-state">
				没有找到匹配的双重策略
			</div>

			<SkillCard
				v-for="skill in filterSkillInfoList"
				:key="skill.name"
				:skill="skill"
				size="normal"
				:show-triggers="true"
				:show-tooltip="true"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
	getAttributeSuggestions,
	getSectSuggestions,
	useFilterStore,
} from '../../domains/filter';
import { getSkillInfoList } from '../../domains/skill';
import { sectConfig } from '../../domains/config';
import SkillCard from '../Public/SkillCard.vue';
import type { Trigger } from '../../interfaces/Trigger.ts';

// 初始化 Store
const filterStore = useFilterStore();
const skillInfoList = getSkillInfoList();

// 双向绑定的筛选状态
const attribute = computed( {
	get: () => filterStore.attribute,
	set: ( val ) => filterStore.setAttribute( val ),
} );

const sect = computed( {
	get: () => filterStore.sect,
	set: ( val ) => filterStore.setSect( val ),
} );

// 复选框状态 - 转换为数组形式用于模板渲染
const sectCheckboxItems = computed( () => [
	{
		key: 'main' as const,
		label: '主流派',
		value: filterStore.sectCheckboxes.main,
	},
	{
		key: 'second' as const,
		label: '副流派',
		value: filterStore.sectCheckboxes.second,
	},
] );

const triggerCheckboxItems = computed( () => [
	{
		key: '普攻' as const,
		label: '普攻',
		value: filterStore.triggerCheckboxes.普攻,
	},
	{
		key: '技能' as const,
		label: '技能',
		value: filterStore.triggerCheckboxes.技能,
	},
	{
		key: '冲刺' as const,
		label: '冲刺',
		value: filterStore.triggerCheckboxes.冲刺,
	},
	{
		key: '召唤' as const,
		label: '召唤',
		value: filterStore.triggerCheckboxes.召唤,
	},
	{
		key: '传承' as const,
		label: '传承',
		value: filterStore.triggerCheckboxes.传承,
	},
] );

// 复选框切换处理
const handleSectCheckboxChange = ( key: 'main' | 'second', value: boolean ) => {
	filterStore.toggleSectCheckbox( key, value );
};

const handleTriggerCheckboxChange = ( key: Trigger, value: boolean ) => {
	filterStore.toggleTriggerCheckbox( key, value );
};

// 自动完成建议
const handleFetchAttributeSuggestions = ( searchString: string, cb: Function ) => {
	const list = getAttributeSuggestions( skillInfoList.value, searchString );
	cb( list );
};

const handleFetchSectSuggestions = ( searchString: string, cb: Function ) => {
	const list = getSectSuggestions( skillInfoList.value, attribute.value, searchString, sectConfig );
	cb( list );
};

// 筛选结果
const filterSkillInfoList = computed( () => filterStore.filterResult.skills );
</script>
