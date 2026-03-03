<style lang="scss" scoped>
/* ============================================
   流派构建页 - 赛博朋克风格
   ============================================ */

.page-container {
	min-height: calc(100vh - 72px);
	padding: 32px;
	max-width: 1600px;
	margin: 0 auto;
}

/* 已激活双重策略区域 */
.activated-section {
	margin-bottom: 48px;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20px;
}

.section-title {
	font-family: var(--font-display);
	font-size: 14px;
	font-weight: 600;
	letter-spacing: 3px;
	text-transform: uppercase;
	color: var(--accent-primary);
	display: flex;
	align-items: center;
	gap: 12px;
	
	&::before {
		content: '';
		width: 4px;
		height: 20px;
		background: linear-gradient(180deg, var(--accent-primary), var(--accent-secondary));
		border-radius: 2px;
	}
}

.section-count {
	font-family: var(--font-display);
	font-size: 12px;
	color: var(--text-muted);
	letter-spacing: 1px;
	
	.count {
		font-size: 24px;
		font-weight: 700;
		color: var(--accent-primary);
		margin: 0 4px;
	}
}

/* 激活的双重策略卡片网格 */
.activated-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 16px;
}

.activated-card {
	background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(255, 61, 61, 0.05) 100%);
	border: 1px solid rgba(0, 212, 255, 0.2);
	border-radius: 12px;
	padding: 16px;
	position: relative;
	overflow: hidden;
	
	/* 角落装饰 */
	&::before,
	&::after {
		content: '';
		position: absolute;
		width: 20px;
		height: 20px;
		border: 1px solid var(--accent-primary);
		opacity: 0.3;
	}
	
	&::before {
		top: 8px;
		left: 8px;
		border-right: none;
		border-bottom: none;
	}
	
	&::after {
		bottom: 8px;
		right: 8px;
		border-left: none;
		border-top: none;
	}
}

.activated-card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
}

.activated-name {
	font-family: var(--font-chinese);
	font-size: 16px;
	font-weight: 700;
	color: var(--text-primary);
}

.activated-triggers {
	display: flex;
	gap: 4px;
}

.activated-trigger-tag {
	font-family: var(--font-display);
	font-size: 9px;
	font-weight: 600;
	letter-spacing: 1px;
	padding: 3px 6px;
	border-radius: 3px;
	background: rgba(0, 212, 255, 0.15);
	color: var(--accent-primary);
}

.activated-sects {
	display: flex;
	gap: 8px;
	align-items: center;
	margin-bottom: 8px;
}

.activated-sect {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 500;
	padding: 4px 10px;
	border-radius: 4px;
	background: rgba(0, 0, 0, 0.3);
	
	&--fire { color: var(--element-fire); border: 1px solid rgba(255, 61, 61, 0.3); }
	&--ice { color: var(--element-ice); border: 1px solid rgba(0, 212, 255, 0.3); }
	&--thunder { color: var(--element-thunder); border: 1px solid rgba(255, 208, 0, 0.3); }
	&--poison { color: var(--element-poison); border: 1px solid rgba(179, 102, 255, 0.3); }
	&--dark { color: var(--element-dark); border: 1px solid rgba(139, 92, 246, 0.3); }
	&--light { color: var(--element-light); border: 1px solid rgba(251, 191, 36, 0.3); }
	&--blade { color: var(--element-blade); border: 1px solid rgba(148, 163, 184, 0.3); }
}

.activated-connector {
	color: var(--text-muted);
	font-size: 12px;
}

.activated-desc {
	font-family: var(--font-chinese);
	font-size: 12px;
	line-height: 1.6;
	color: var(--text-secondary);
}

/* 空状态 */
.empty-activated {
	grid-column: 1 / -1;
	text-align: center;
	padding: 40px;
	border: 1px dashed var(--border-primary);
	border-radius: 12px;
}

.empty-text {
	font-family: var(--font-chinese);
	font-size: 14px;
	color: var(--text-muted);
}

/* 继承筛选 */
.inherit-filters {
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
}

.inherit-filter {
	padding: 6px 12px;
	border-radius: 6px;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid var(--border-primary);
	transition: all var(--transition-normal);
	
	&:hover {
		border-color: var(--border-glow);
	}
	
	&.is-active {
		border-color: var(--accent-primary);
		background: rgba(0, 212, 255, 0.1);
	}
}

/* 技能槽位构建区域 */
.builder-section {
	margin-top: 32px;
}

.builder-grid {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

/* 单个技能槽位行 */
.slot-row {
	display: flex;
	gap: 24px;
	align-items: stretch;
}

/* 槽位卡片 */
.slot-card {
	flex-shrink: 0;
	width: 140px;
	background: var(--bg-card);
	border: 1px solid var(--border-primary);
	border-radius: 12px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
	cursor: pointer;
	transition: all var(--transition-normal);
	
	/* 左侧装饰条 */
	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 16px;
		bottom: 16px;
		width: 3px;
		background: var(--slot-color, var(--accent-primary));
		border-radius: 0 2px 2px 0;
		opacity: 0.6;
	}
	
	&:hover {
		border-color: var(--slot-color, var(--border-glow));
		background: var(--bg-card-hover);
		transform: translateY(-2px);
		
		.slot-icon {
			transform: scale(1.1);
		}
	}
	
	/* 槽位主题色 */
	&--attack { --slot-color: var(--element-fire); }
	&--skill { --slot-color: var(--element-thunder); }
	&--sprint { --slot-color: var(--element-ice); }
	&--inherit { --slot-color: var(--element-dark); }
	&--summon { --slot-color: var(--element-poison); }
}

.slot-icon {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.4);
	border: 2px solid var(--slot-color, var(--accent-primary));
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12px;
	transition: transform var(--transition-normal);
	
	/* 六边形内部 */
	.inner-hex {
		width: 20px;
		height: 20px;
		background: var(--slot-color, var(--accent-primary));
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
		opacity: 0.6;
	}
}

.slot-name {
	font-family: var(--font-display);
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: var(--text-secondary);
	margin-bottom: 8px;
}

.slot-sect {
	font-family: var(--font-chinese);
	font-size: 14px;
	font-weight: 600;
	color: var(--slot-color, var(--accent-primary));
	text-align: center;
	
	&--empty {
		color: var(--text-muted);
		font-weight: 400;
		font-size: 12px;
	}
}

/* 可选技能列表 */
.selectable-skills {
	flex: 1;
	min-width: 0;
}

.selectable-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 12px;
}

.selectable-card {
	background: rgba(0, 0, 0, 0.2);
	border: 1px solid var(--border-primary);
	border-radius: 8px;
	padding: 14px;
	cursor: pointer;
	transition: all var(--transition-normal);
	
	&:hover {
		border-color: var(--border-glow);
		background: rgba(0, 212, 255, 0.03);
		transform: translateX(4px);
	}
}

.selectable-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.selectable-name {
	font-family: var(--font-chinese);
	font-size: 14px;
	font-weight: 600;
	color: var(--text-primary);
}

.selectable-attribute {
	font-family: var(--font-display);
	font-size: 10px;
	font-weight: 600;
	letter-spacing: 1px;
	padding: 2px 8px;
	border-radius: 4px;
	
	&--fire { background: rgba(255, 61, 61, 0.2); color: var(--element-fire); }
	&--ice { background: rgba(0, 212, 255, 0.2); color: var(--element-ice); }
	&--thunder { background: rgba(255, 208, 0, 0.2); color: var(--element-thunder); }
	&--poison { background: rgba(179, 102, 255, 0.2); color: var(--element-poison); }
	&--dark { background: rgba(139, 92, 246, 0.2); color: var(--element-dark); }
	&--light { background: rgba(251, 191, 36, 0.2); color: var(--element-light); }
	&--blade { background: rgba(148, 163, 184, 0.2); color: var(--element-blade); }
}

.selectable-sects {
	display: flex;
	gap: 6px;
	align-items: center;
	margin-bottom: 6px;
}

.selectable-sect {
	font-family: var(--font-chinese);
	font-size: 12px;
	color: var(--text-secondary);
	
	&--active {
		color: var(--text-muted);
		text-decoration: line-through;
	}
	
	&--highlight {
		color: var(--accent-primary);
		font-weight: 500;
	}
}

.selectable-desc {
	font-family: var(--font-chinese);
	font-size: 11px;
	line-height: 1.5;
	color: var(--text-muted);
}

/* 响应式 */
@media (max-width: 1024px) {
	.slot-row {
		flex-direction: column;
	}
	
	.slot-card {
		width: 100%;
		flex-direction: row;
		justify-content: flex-start;
		gap: 16px;
		
		.slot-icon {
			margin-bottom: 0;
		}
	}
}

@media (max-width: 768px) {
	.page-container {
		padding: 16px;
	}
	
	.activated-grid {
		grid-template-columns: 1fr;
	}
	
	.selectable-grid {
		grid-template-columns: 1fr;
	}
}
</style>

<template>
	<div class="page-container">
		<!-- 已激活的双重策略 -->
		<section class="activated-section">
			<div class="section-header">
				<h2 class="section-title">已激活策略</h2>
				<span class="section-count">
					共 <span class="count">{{ activatedSkills.length }}</span> 条
				</span>
			</div>
			
			<!-- 继承筛选 -->
			<div class="inherit-filters" style="margin-bottom: 16px;">
				<template v-for="trigger in triggerList" :key="trigger">
					<label 
						:class="['inherit-filter', { 'is-active': isInheritChecked(trigger) }]"
					>
						<el-checkbox 
							:model-value="isInheritChecked(trigger)"
							@change="(val: boolean) => toggleInherit(trigger, val)"
							:label="trigger"
						/>
					</label>
				</template>
			</div>
			
			<div class="activated-grid">
				<div v-if="activatedSkills.length === 0" class="empty-activated">
					<span class="empty-text">选择流派以激活双重策略</span>
				</div>
				
				<div 
					v-for="skill in activatedSkills" 
					:key="skill.name"
					class="activated-card"
				>
					<div class="activated-card-header">
						<span class="activated-name">{{ skill.name }}</span>
						<div class="activated-triggers">
							<span 
								v-for="trigger in skill.trigger" 
								:key="trigger"
								class="activated-trigger-tag"
							>{{ trigger }}</span>
						</div>
					</div>
					
					<div class="activated-sects">
						<span 
							:class="['activated-sect', `activated-sect--${styleMapper[skill.mainAttribute]}`]"
						>{{ skill.mainSect }}</span>
						<span class="activated-connector">⊕</span>
						<span 
							:class="['activated-sect', `activated-sect--${styleMapper[skill.secondAttribute]}`]"
						>{{ skill.secondSect }}</span>
					</div>
					
					<p class="activated-desc">{{ skill.description }}</p>
				</div>
			</div>
		</section>
		
		<!-- 技能槽位构建 -->
		<section class="builder-section">
			<div class="section-header">
				<h2 class="section-title">流派配置</h2>
			</div>
			
			<div class="builder-grid">
				<div 
					v-for="skillCard in skillCardInfoList" 
					:key="skillCard.triggerName"
					class="slot-row"
				>
					<skill-card :skillCardInfo="skillCard" @open-dialog="openDialog"/>
					<selectable-skill-card :skillCardInfo="skillCard"/>
				</div>
			</div>
		</section>
		
		<!-- 修改流派对话框 -->
		<el-dialog
			v-model="isShowDialog"
			title="修改技能流派"
			width="480px"
			:show-close="true"
		>
			<change-skill-sect-form
				:trigger-name="currentTrigger"
				@close-dialog="closeDialog"
			/>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import SkillCard from '../components/SectBuilderPage/SkillCard.vue';
import SelectableSkillCard from '../components/SectBuilderPage/SelectableSkillCard.vue';
import ChangeSkillSectForm from '../components/SectBuilderPage/ChangeSkillSectForm.vue';
import { useSkillCardInfoStore } from '../store/useSkillCardInfoStore.ts';
import { useSkillInfoStore } from '../store/useSkillInfoStore.ts';
import { SkillCardInfoTuple } from '../interfaces/SkillCardInfoTuple.ts';
import { SkillInfoInterface } from '../interfaces/SkillInfoInterface.ts';
import { Trigger } from '../interfaces/Trigger.ts';
import { Attribute } from '../interfaces/Attribute.ts';

const skillCardInfoStore = useSkillCardInfoStore();
const skillInfoStore = useSkillInfoStore();

/* 技能卡片列表 */
const skillCardInfoList = computed<SkillCardInfoTuple>(
	() => skillCardInfoStore.skillCardInfoList
);

/* 触发位列表 */
const triggerList: Trigger[] = ['普攻', '技能', '冲刺', '传承', '召唤'];

/* 继承状态 */
const isInheritChecked = (trigger: Trigger) => {
	const card = skillCardInfoStore.skillCardInfoList.find(c => c.triggerName === trigger);
	return card?.inherit || false;
};

const toggleInherit = (trigger: Trigger, value: boolean) => {
	skillCardInfoStore.updateSkillCardInfoInherit(trigger, value);
};

/* 已激活的双重策略 */
const activatedSkills = computed<SkillInfoInterface[]>(() => {
	const sectList = skillCardInfoStore.skillCardInfoList
		.filter(card => card.sect)
		.map(card => card.sect);
	
	return skillInfoStore.skillInfoList.filter(skill =>
		sectList.includes(skill.mainSect) && sectList.includes(skill.secondSect)
	);
});

/* 样式映射 */
const styleMapper: Record<Attribute, string> = {
	'火': 'fire',
	'冰': 'ice',
	'电': 'thunder',
	'毒': 'poison',
	'暗': 'dark',
	'光': 'light',
	'刃': 'blade',
};

/* 对话框控制 */
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