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
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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
						<el-checkbox v-for="item in sectCheckboxes" :key="item.key" v-model="item.value" :label="item.label" />
					</div>

					<div class="checkbox-row">
						<span class="checkbox-label">槽位</span>
						<el-checkbox v-for="item in triggerCheckboxes" :key="item.key" v-model="item.value" :label="item.label" />
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
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { Attribute } from '../../interfaces/Attribute.ts';
import { computed, ref, reactive } from 'vue';
import { Sect } from '../../interfaces/Sect.ts';
import { SectValue } from '../../interfaces/SectValue.ts';
import { sectConfig, getSkillsBySect } from '../../config/sectConfig.ts';
import { Trigger } from '../../interfaces/Trigger.ts';

const skillInfoStore = useSkillInfoStore();

const attribute = ref<Attribute | ''>('');
const sect = ref<Sect[keyof Sect] | ''>('');

const sectCheckboxes = reactive([
	{ key: 'main', label: '主流派', value: true },
	{ key: 'second', label: '副流派', value: true },
]);

const triggerCheckboxes = reactive([
	{ key: 'attack', label: '普攻', value: true },
	{ key: 'skill', label: '技能', value: true },
	{ key: 'sprint', label: '冲刺', value: true },
	{ key: 'call', label: '召唤', value: true },
	{ key: 'inherit', label: '传承', value: true },
]);

const handleFetchAttributeSuggestions = (searchString: string, cb: Function) => {
	const attributeSet: Set<Attribute> = new Set();
	skillInfoStore.skillInfoList.forEach(item => attributeSet.add(item.mainAttribute));
	const list = Array.from(attributeSet).map(item => ({ value: item }));
	cb(searchString ? list.filter(item => item.value.includes(searchString)) : list);
};

const handleFetchSectSuggestions = (searchString: string, cb: Function) => {
	const sectSet: Set<SectValue> = new Set();
	skillInfoStore.skillInfoList.forEach(item => sectSet.add(item.mainSect));
	let list: { value: SectValue }[] = Array.from(sectSet).map(item => ({ value: item }));

	if (attribute.value.trim()) {
		list = sectConfig[<Attribute>attribute.value.trim()].map(item => ({ value: item as SectValue }));
	}

	cb(searchString ? list.filter(item => item.value.includes(searchString)) : list);
};

const filterSkillInfoList = computed(() => {
	return skillInfoStore.skillInfoList.filter(skillInfo => {
		const isMain = sectCheckboxes[0].value
			&& skillInfo.mainAttribute.includes(attribute.value)
			&& skillInfo.mainSect.includes(sect.value);

		const isSecond = sectCheckboxes[1].value
			&& skillInfo.secondAttribute.includes(attribute.value)
			&& skillInfo.secondSect.includes(sect.value);

		const uncheckedTriggers: Trigger[] = [
			triggerCheckboxes[0].value || '普攻',
			triggerCheckboxes[1].value || '技能',
			triggerCheckboxes[2].value || '冲刺',
			triggerCheckboxes[3].value || '召唤',
			triggerCheckboxes[4].value || '传承',
		].filter(item => item !== true) as Trigger[];

		const isTrigger = skillInfo.trigger.every(t => uncheckedTriggers.includes(t));

		return (isMain || isSecond) && !isTrigger;
	});
});

const styleMapper: Record<Attribute, string> = {
	'火': 'fire', '冰': 'ice', '电': 'thunder',
	'毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};

const getSkillDisplay = (sectName: string): string => {
	return getSkillsBySect(sectName);
};
</script>
