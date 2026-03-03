<style lang="scss" scoped>
/* ============================================
   可选技能列表组件 - 赛博朋克风格
   ============================================ */

.selectable-container {
	flex: 1;
	min-width: 0;
}

/* 空状态 */
.empty-state {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
	background: rgba(0, 0, 0, 0.2);
	border: 1px dashed var(--border-primary);
	border-radius: 12px;
	min-height: 120px;
}

.empty-text {
	font-family: var(--font-chinese);
	font-size: 13px;
	color: var(--text-muted);
}

/* 技能网格 */
.skills-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	gap: 12px;
}

/* 技能卡片 */
.skill-item {
	background: rgba(0, 0, 0, 0.25);
	border: 1px solid var(--border-primary);
	border-radius: 10px;
	padding: 14px 16px;
	cursor: pointer;
	transition: all var(--transition-normal);
	position: relative;
	overflow: hidden;
	
	/* 左侧指示条 */
	&::before {
		content: '';
		position: absolute;
		left: 0;
		top: 8px;
		bottom: 8px;
		width: 2px;
		background: var(--item-accent, var(--accent-primary));
		opacity: 0.6;
		transition: all var(--transition-normal);
	}
	
	&:hover {
		border-color: var(--item-accent, var(--border-glow));
		background: rgba(0, 212, 255, 0.03);
		transform: translateX(4px);
		
		&::before {
			opacity: 1;
			width: 3px;
		}
		
		.skill-name {
			color: var(--item-accent, var(--accent-primary));
		}
	}
	
	/* 元素主题 */
	&--fire { --item-accent: var(--element-fire); }
	&--ice { --item-accent: var(--element-ice); }
	&--thunder { --item-accent: var(--element-thunder); }
	&--poison { --item-accent: var(--element-poison); }
	&--dark { --item-accent: var(--element-dark); }
	&--light { --item-accent: var(--element-light); }
	&--blade { --item-accent: var(--element-blade); }
}

/* 头部 */
.item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.skill-name {
	font-family: var(--font-chinese);
	font-size: 14px;
	font-weight: 600;
	color: var(--text-primary);
	transition: color var(--transition-fast);
}

.skill-attribute {
	font-family: var(--font-display);
	font-size: 9px;
	font-weight: 600;
	letter-spacing: 1px;
	text-transform: uppercase;
	padding: 3px 8px;
	border-radius: 4px;
	background: rgba(0, 0, 0, 0.4);
	
	&--fire { 
		background: rgba(255, 61, 61, 0.15); 
		color: var(--element-fire); 
		border: 1px solid rgba(255, 61, 61, 0.3);
	}
	&--ice { 
		background: rgba(0, 212, 255, 0.15); 
		color: var(--element-ice);
		border: 1px solid rgba(0, 212, 255, 0.3);
	}
	&--thunder { 
		background: rgba(255, 208, 0, 0.15); 
		color: var(--element-thunder);
		border: 1px solid rgba(255, 208, 0, 0.3);
	}
	&--poison { 
		background: rgba(179, 102, 255, 0.15); 
		color: var(--element-poison);
		border: 1px solid rgba(179, 102, 255, 0.3);
	}
	&--dark { 
		background: rgba(139, 92, 246, 0.15); 
		color: var(--element-dark);
		border: 1px solid rgba(139, 92, 246, 0.3);
	}
	&--light { 
		background: rgba(251, 191, 36, 0.15); 
		color: var(--element-light);
		border: 1px solid rgba(251, 191, 36, 0.3);
	}
	&--blade { 
		background: rgba(148, 163, 184, 0.15); 
		color: var(--element-blade);
		border: 1px solid rgba(148, 163, 184, 0.3);
	}
}

/* 流派组合 */
.sect-combo {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
	flex-wrap: wrap;
}

.sect-tag {
	font-family: var(--font-chinese);
	font-size: 12px;
	font-weight: 500;
	padding: 3px 10px;
	border-radius: 4px;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid var(--border-primary);
	
	&--main {
		color: var(--item-accent, var(--accent-primary));
		border-color: rgba(0, 212, 255, 0.2);
	}
	
	&--second {
		color: var(--text-secondary);
	}
	
	&--active {
		text-decoration: line-through;
		color: var(--text-muted);
	}
	
	&--highlight {
		border-color: var(--item-accent, var(--accent-primary));
		background: rgba(0, 212, 255, 0.05);
	}
}

.sect-connector {
	color: var(--text-muted);
	font-size: 10px;
}

/* 描述 */
.skill-desc {
	font-family: var(--font-chinese);
	font-size: 11px;
	line-height: 1.6;
	color: var(--text-muted);
}

/* 响应式 */
@media (max-width: 768px) {
	.skills-grid {
		grid-template-columns: 1fr;
	}
}
</style>

<template>
	<div class="selectable-container">
		<div v-if="filterDetailList.length === 0" class="empty-state">
			<span class="empty-text">选择流派后显示可组合的双重策略</span>
		</div>
		
		<div v-else class="skills-grid">
			<div 
				v-for="detail in filterDetailList"
				:key="detail.name"
				:class="['skill-item', `skill-item--${styleMapper[detail.mainAttribute]}`]"
			>
				<div class="item-header">
					<span class="skill-name">{{ detail.name }}</span>
					<span 
						:class="['skill-attribute', `skill-attribute--${styleMapper[highlightAttribute(detail)]}`]"
					>{{ highlightAttribute(detail) }}</span>
				</div>
				
				<div class="sect-combo">
					<span 
						:class="[
							'sect-tag',
							'sect-tag--main',
							{ 'sect-tag--active': detail.mainSect === skillCardInfo.sect },
							{ 'sect-tag--highlight': detail.mainSect !== skillCardInfo.sect }
						]"
					>{{ detail.mainSect }}</span>
					<span class="sect-connector">⊕</span>
					<span 
						:class="[
							'sect-tag',
							'sect-tag--second',
							{ 'sect-tag--active': detail.secondSect === skillCardInfo.sect },
							{ 'sect-tag--highlight': detail.secondSect !== skillCardInfo.sect }
						]"
					>{{ detail.secondSect }}</span>
				</div>
				
				<p class="skill-desc">{{ detail.description }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { SkillCardInfo } from '../../interfaces/SkillCardInfo.ts';
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { useSkillCardInfoStore } from '../../store/useSkillCardInfoStore.ts';
import { SkillInfoInterface } from '../../interfaces/SkillInfoInterface.ts';
import { Attribute } from '../../interfaces/Attribute.ts';

const props = defineProps<{
	skillCardInfo: SkillCardInfo;
}>();

const skillInfoStore = useSkillInfoStore();
const skillCardInfoStore = useSkillCardInfoStore();

/* 过滤可选技能 */
const filterDetailList = computed<SkillInfoInterface[]>(() => {
	// 获取包含当前流派的双重技能
	let selectableList = skillInfoStore.skillInfoList.filter(skill => {
		return props.skillCardInfo.sect && (
			skill.mainSect.includes(props.skillCardInfo.sect) ||
			skill.secondSect.includes(props.skillCardInfo.sect)
		);
	});
	
	// 排除已占用触发位
	const existingTriggers = skillCardInfoStore.skillCardInfoList
		.filter(card => card.sect || card.inherit)
		.map(card => card.triggerName);
	
	selectableList = selectableList.filter(skill => {
		return skill.trigger.some(t => !existingTriggers.includes(t));
	});
	
	return selectableList;
});

/* 高亮属性（非当前流派的属性） */
const highlightAttribute = (skill: SkillInfoInterface): Attribute => {
	if (skill.mainSect === props.skillCardInfo.sect) {
		return skill.secondAttribute;
	}
	return skill.mainAttribute;
};

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
</script>