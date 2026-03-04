<style lang="scss" scoped>
.page-container {
	min-height: calc(100vh - 60px);
	padding: 24px;
	max-width: 1280px;
	margin: 0 auto;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
}

.section-title {
	font-family: var(--font-chinese);
	font-size: 14px;
	font-weight: 600;
	color: hsl(var(--foreground));
}

.section-count {
	font-family: var(--font-chinese);
	font-size: 12px;
	color: hsl(var(--muted-foreground));
}

.activated-section {
	margin-bottom: 32px;
}

.activated-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 12px;
}

.activated-card {
	background: hsl(var(--card));
	border: 1px solid hsl(var(--border));
	border-radius: var(--radius);
	padding: 12px;
}

.activated-card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.activated-name {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 600;
	color: hsl(var(--foreground));
}

.activated-triggers {
	display: flex;
	gap: 4px;
}

.activated-trigger-tag {
	font-family: var(--font-chinese);
	font-size: 10px;
	padding: 2px 6px;
	border-radius: calc(var(--radius) - 4px);
	background: hsl(var(--secondary));
	color: hsl(var(--secondary-foreground));
}

.activated-sects {
	display: flex;
	gap: 6px;
	align-items: center;
	margin-bottom: 6px;
}

.activated-sect {
	display: flex;
	align-items: center;
	gap: 4px;
	font-family: var(--font-chinese);
	font-size: 12px;
	color: hsl(var(--foreground));
}

.activated-connector {
	color: hsl(var(--muted-foreground));
	font-size: 10px;
}

.activated-desc {
	font-family: var(--font-chinese);
	font-size: 12px;
	color: hsl(var(--muted-foreground));
}

.inherit-filters {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	margin-bottom: 12px;
}

.empty-activated {
	grid-column: 1 / -1;
	text-align: center;
	padding: 32px;
	border: 1px dashed hsl(var(--border));
	border-radius: var(--radius);
	color: hsl(var(--muted-foreground));
}

.builder-section {
	margin-top: 24px;
}

.builder-grid {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.slot-row {
	display: flex;
	gap: 16px;
	align-items: stretch;
}

@media (max-width: 768px) {
	.page-container {
		padding: 16px;
	}

	.slot-row {
		flex-direction: column;
	}
}
</style>

<template>
	<div class="page-container">
		<section class="activated-section">
			<div class="section-header">
				<h2 class="section-title">已激活策略</h2>
				<span class="section-count">共 {{ activatedSkills.length }} 条</span>
			</div>

			<div class="inherit-filters">
				<el-checkbox
					v-for="trigger in triggerList"
					:key="trigger"
					:model-value="isInheritChecked(trigger)"
					@change="(val: boolean) => toggleInherit(trigger, val)"
					:label="trigger"
				/>
			</div>

			<div class="activated-grid">
				<div v-if="activatedSkills.length === 0" class="empty-activated">
					选择流派以激活双重策略
				</div>

				<div v-for="skill in activatedSkills" :key="skill.name" class="activated-card">
					<div class="activated-card-header">
						<span class="activated-name">{{ skill.name }}</span>
						<div class="activated-triggers">
							<span v-for="trigger in skill.trigger" :key="trigger" class="activated-trigger-tag">{{ trigger }}</span>
						</div>
					</div>
					<div class="activated-sects">
						<span class="activated-sect">
							<span :class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
							{{ skill.mainSect }}
						</span>
						<span class="activated-connector">+</span>
						<span class="activated-sect">
							<span :class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"></span>
							{{ skill.secondSect }}
						</span>
					</div>
					<p class="activated-desc">{{ skill.description }}</p>
				</div>
			</div>
		</section>

		<section class="builder-section">
			<div class="section-header">
				<h2 class="section-title">流派配置</h2>
			</div>

			<div class="builder-grid">
				<div v-for="skillCard in skillCardInfoList" :key="skillCard.triggerName" class="slot-row">
					<skill-card :skillCardInfo="skillCard" @open-dialog="openDialog" />
					<selectable-skill-card :skillCardInfo="skillCard" />
				</div>
			</div>
		</section>

		<el-dialog v-model="isShowDialog" title="修改技能流派" width="400px">
			<change-skill-sect-form :trigger-name="currentTrigger" @close-dialog="closeDialog" />
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import SkillCard from '../components/SectBuilderPage/SkillCard.vue';
import SelectableSkillCard from '../components/SectBuilderPage/SelectableSkillCard.vue';
import ChangeSkillSectForm from '../components/SectBuilderPage/ChangeSkillSectForm.vue';
import { useBuilderStore, type SkillCardInfoTuple } from '../domains/builder/index.ts';
import { triggerList } from '../domains/config/index.ts';
import type { Trigger } from '../interfaces/Trigger.ts';
import type { Attribute } from '../interfaces/Attribute.ts';

const builderStore = useBuilderStore();

const skillCardInfoList = computed<SkillCardInfoTuple>(() => builderStore.skillCardInfoList as SkillCardInfoTuple);

const isInheritChecked = (trigger: Trigger) => {
	const card = builderStore.getSkillCardByTrigger(trigger);
	return card?.inherit || false;
};

const toggleInherit = (trigger: Trigger, value: boolean) => {
	builderStore.updateSkillCardInherit(trigger, value);
};

const activatedSkills = computed(() => builderStore.activatedSkills.skills);

const styleMapper: Record<Attribute, string> = {
	'火': 'fire', '冰': 'ice', '电': 'thunder',
	'毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};

const isShowDialog = ref(false);
const currentTrigger = ref<Trigger>('普攻');

const openDialog = (trigger: Trigger) => {
	currentTrigger.value = trigger;
	isShowDialog.value = true;
};

const closeDialog = () => {
	isShowDialog.value = false;
};
</script>
