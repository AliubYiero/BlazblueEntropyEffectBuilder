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
	color: var(--foreground);
	
	&-tooltip {
		padding-left: 8px;
		color: var(--muted-foreground);
		font-weight: lighter;
		font-size: 12px;
	}
}

.section-count {
	font-family: var(--font-chinese);
	font-size: 12px;
	color: var(--muted-foreground);
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

.inherit-filters :deep(.el-checkbox.is-pending .el-checkbox__inner) {
	border-style: dashed;
	border-color: var(--primary) !important;
	background: transparent;
	
	&::after {
		display: none;
	}
}

.inherit-filters :deep(.el-checkbox.is-pending.is-checked .el-checkbox__inner) {
	border-style: dashed;
}

.empty-activated {
	grid-column: 1 / -1;
	text-align: center;
	padding: 32px;
	border: 1px dashed var(--border);
	border-radius: var(--radius);
	color: var(--muted-foreground);
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
				<h2 class="section-title">
					<span>已激活策略</span>
					<span
						class="section-title-tooltip">(点击勾选框可选择继承的双重策略)</span>
				</h2>
				<span class="section-count">共 {{
						activatedSkills.length
					}} 条</span>
			</div>
			
			<div class="inherit-filters">
				<el-checkbox
					v-for="trigger in triggerList"
					:key="trigger"
					:class="{ 'is-pending': isInheritPending(trigger) }"
					:indeterminate="isInheritPending(trigger)"
					:label="trigger"
					:model-value="isInheritChecked(trigger)"
					@change="() => handleInheritClick(trigger)"
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
					:show-tooltip="false"
					:show-triggers="true"
					:skill="skill"
					size="normal"
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
		
		<el-dialog v-model="isShowInheritDialog" title="继承双重策略"
		           width="400px">
			<InheritSkillForm :trigger-name="currentInheritTrigger"
			                  @close-dialog="closeInheritDialog"/>
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
import InheritSkillForm
	from '../components/SectBuilderPage/InheritSkillForm.vue';
import SkillCard from '../components/Public/SkillCard.vue';
import {
	type SkillCardInfoTuple,
	useBuilderStore,
} from '../domains/builder/index.ts';
import { triggerList } from '../domains/config/index.ts';
import type { Trigger } from '../interfaces/Trigger.ts';

const builderStore = useBuilderStore();

const skillCardInfoList = computed<SkillCardInfoTuple>( () => builderStore.skillCardInfoList as SkillCardInfoTuple );

const activatedSkills = computed( () => builderStore.activatedSkills.skills );

const isInheritChecked = ( trigger: Trigger ) => builderStore.getCheckboxState( trigger ) === 'checked';
const isInheritPending = ( trigger: Trigger ) => builderStore.getCheckboxState( trigger ) === 'pending';

/**
 * 处理 checkbox 点击
 */
const handleInheritClick = ( trigger: Trigger ) => {
	const state = builderStore.getCheckboxState( trigger );
	if ( state === 'checked' ) {
		builderStore.clearInheritSkill( trigger );
	}
	else {
		// pending 或 unchecked -> 打开继承对话框
		currentInheritTrigger.value = trigger;
		isShowInheritDialog.value = true;
	}
};

// 修改技能流派对话框
const isShowDialog = ref( false );
const currentTrigger = ref<Trigger>( '普攻' );

const openDialog = ( trigger: Trigger ) => {
	currentTrigger.value = trigger;
	isShowDialog.value = true;
};

const closeDialog = () => {
	isShowDialog.value = false;
};

// 继承双重策略对话框
const isShowInheritDialog = ref( false );
const currentInheritTrigger = ref<Trigger>( '普攻' );

const closeInheritDialog = () => {
	isShowInheritDialog.value = false;
};
</script>
