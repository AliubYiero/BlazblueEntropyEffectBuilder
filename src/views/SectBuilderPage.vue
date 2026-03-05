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
				<span class="section-count">共 {{
						activatedSkills.length
					}} 条</span>
			</div>
			
			<div class="inherit-filters">
				<el-checkbox
					v-for="trigger in triggerList"
					:key="trigger"
					:label="trigger"
					:model-value="isInheritChecked(trigger)"
					@change="(val: boolean) => toggleInherit(trigger, val)"
				/>
			</div>
			
			<div class="activated-grid">
				<div v-if="activatedSkills.length === 0"
				     class="empty-activated">
					选择流派以激活双重策略
				</div>
				
				<SkillCard
					v-for="skill in activatedSkills"
					:key="skill.name"
					:skill="skill"
					size="normal"
					:show-triggers="true"
					:show-tooltip="false"
				/>
			</div>
		</section>
		
		<section class="builder-section">
			<div class="section-header">
				<h2 class="section-title">流派配置</h2>
			</div>
			
			<div class="builder-grid">
				<div v-for="skillCard in skillCardInfoList"
				     :key="skillCard.triggerName" class="slot-row">
					<select-skill-card :skillCardInfo="skillCard"
					                   @open-dialog="openDialog"/>
					<selectable-skill-card :skillCardInfo="skillCard"/>
				</div>
			</div>
		</section>
		
		<el-dialog v-model="isShowDialog" title="修改技能流派" width="400px">
			<change-skill-sect-form :trigger-name="currentTrigger"
			                        @close-dialog="closeDialog"/>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import SelectSkillCard from '../components/SectBuilderPage/SelectSkillCard.vue';
import SelectableSkillCard
	from '../components/SectBuilderPage/SelectableSkillCard.vue';
import ChangeSkillSectForm
	from '../components/SectBuilderPage/ChangeSkillSectForm.vue';
import SkillCard from '../components/Public/SkillCard.vue';
import {
	type SkillCardInfoTuple,
	useBuilderStore,
} from '../domains/builder/index.ts';
import { triggerList } from '../domains/config/index.ts';
import type { Trigger } from '../interfaces/Trigger.ts';

const builderStore = useBuilderStore();

const skillCardInfoList = computed<SkillCardInfoTuple>( () => builderStore.skillCardInfoList as SkillCardInfoTuple );

const isInheritChecked = ( trigger: Trigger ) => {
	const card = builderStore.getSkillCardByTrigger( trigger );
	return card?.inherit || false;
};

const toggleInherit = ( trigger: Trigger, value: boolean ) => {
	builderStore.updateSkillCardInherit( trigger, value );
};

const activatedSkills = computed( () => builderStore.activatedSkills.skills );

const isShowDialog = ref( false );
const currentTrigger = ref<Trigger>( '普攻' );

const openDialog = ( trigger: Trigger ) => {
	currentTrigger.value = trigger;
	isShowDialog.value = true;
};

const closeDialog = () => {
	isShowDialog.value = false;
};
</script>
