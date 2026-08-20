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

.slot-cards {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	gap: 12px;
	margin-bottom: 12px;
}

.slot-card {
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 6px;
	cursor: pointer;
}

.skill-card, .slot-card__empty {
	height: 115px;
}

.slot-card__trigger {
	font-family: var(--font-chinese);
	font-size: 11px;
	font-weight: 500;
	color: var(--muted-foreground);
	display: flex;
	align-items: center;
	gap: 6px;
	padding-left: 4px;
}

.slot-card__empty {
	font-family: var(--font-chinese);
	line-height: 60px;
	font-size: 12px;
	color: var(--muted-foreground);
	border: 1px dashed var(--border);
	border-radius: var(--radius);
	padding: 24px 16px;
	text-align: center;
	background: transparent;
}

.slot-card__badge {
	font-family: var(--font-chinese);
	font-size: 10px;
	line-height: 1;
	padding: 2px 6px;
	border-radius: calc(var(--radius) - 4px);
	background: var(--primary);
	color: var(--primary-foreground);
}

.slot-card__remove {
	position: absolute;
	top: -2px;
	right: -2px;
	z-index: 1;
	font-size: 14px;
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: 50%;
	padding: 2px;
	opacity: 0.7;
	cursor: pointer;
	transition: opacity 0.15s ease;

	&:hover {
		opacity: 1;
	}
}

// 锁定：实线（SkillCard 默认边框）
// 多触发虚线预占（isLocked=false）
.slot-card.is-pending :deep(.skill-card) {
	border-style: dashed;
	border-color: var(--primary);

	&:hover {
		border-color: var(--primary);
	}
}

// 手动 pin：主色高亮边框（实线）
.slot-card.is-manual :deep(.skill-card) {
	border-color: var(--primary);
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
						class="section-title-tooltip">(点击空位或虚线卡片可手动选择策略)</span>
				</h2>
				<span class="section-count">共 {{
						activatedSkillsCount
					}} 条</span>
			</div>

			<div class="slot-cards">
				<div
					v-for="item in slotCards"
					:key="item.trigger"
					:class="['slot-card', slotCardClass(item.trigger)]"
					@click="handleSlotCardClick(item.trigger)"
				>
					<el-icon
						v-if="isSlotManual(item.trigger)"
						class="slot-card__remove"
						@click.stop="handleRemoveManual(item.trigger)"
					>
						<Close/>
					</el-icon>
					<div class="slot-card__trigger">
						{{ item.trigger }}
						<span
							v-if="isSlotManual(item.trigger)"
							class="slot-card__badge">手动</span>
					</div>
					<SkillCard
						v-if="item.assignment"
						:skill="item.assignment.skill"
						size="compact"
						:show-tooltip="false"
						:show-triggers="true"
					/>
					<div v-else class="slot-card__empty">未占用</div>
				</div>
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
		
		<el-dialog v-model="isShowInheritDialog" title="手动选择双重策略"
		           width="400px">
			<InheritSkillForm :trigger-name="currentInheritTrigger"
			                  @close-dialog="closeInheritDialog"/>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Close } from '@element-plus/icons-vue';
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

const activatedSkillsCount = computed( () => builderStore.activatedSkills.count );

/**
 * 当前触发位的槽位分配（未分配返回 undefined）
 */
const assignmentOf = ( trigger: Trigger ) => builderStore.slotAssignments.get( trigger );

/**
 * 每个触发位的槽位卡片数据（含触发位 + 其分配，供模板渲染 SkillCard）
 */
const slotCards = computed( () =>
	triggerList.map( trigger => ( {
		trigger,
		assignment: builderStore.slotAssignments.get( trigger ),
	} ) ),
);

const isSlotManual = ( trigger: Trigger ) => assignmentOf( trigger )?.source === 'manual';

/**
 * 槽位卡片的样式类：锁定=实线，预占=虚线，空=占位，手动=高亮+角标
 */
const slotCardClass = ( trigger: Trigger ) => {
	const assignment = assignmentOf( trigger );
	if ( !assignment ) {
		return { 'is-empty': true };
	}
	return {
		'is-locked': assignment.isLocked,
		'is-pending': !assignment.isLocked,
		'is-manual': assignment.source === 'manual',
	};
};

/**
 * 点击槽位卡片
 * @description 空位/虚线预占 → 打开手动选择对话框；自动锁定 → 只读；手动 pin → 由删除按钮处理
 */
const handleSlotCardClick = ( trigger: Trigger ) => {
	const assignment = assignmentOf( trigger );
	if ( !assignment ) {
		currentInheritTrigger.value = trigger;
		isShowInheritDialog.value = true;
		return;
	}
	if ( assignment.source === 'manual' || assignment.isLocked ) {
		return;
	}
	// 虚线预占 → 打开手动选择
	currentInheritTrigger.value = trigger;
	isShowInheritDialog.value = true;
};

/**
 * 删除手动 pin
 */
const handleRemoveManual = ( trigger: Trigger ) => {
	builderStore.clearManualSkill( trigger );
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

// 手动选择双重策略对话框
const isShowInheritDialog = ref( false );
const currentInheritTrigger = ref<Trigger>( '普攻' );

const closeInheritDialog = () => {
	isShowInheritDialog.value = false;
};
</script>
