<style lang="scss" scoped>
/* ============================================
   技能卡片组件 - 赛博朋克风格
   ============================================ */

.skill-card {
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
	overflow: hidden;
	
	/* 顶部装饰条 */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, 
			transparent, 
			var(--slot-color, var(--accent-primary)), 
			transparent);
	}
	
	/* 背景网格 */
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background-image: 
			linear-gradient(rgba(0, 212, 255, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 212, 255, 0.02) 1px, transparent 1px);
		background-size: 20px 20px;
		opacity: 0.5;
		pointer-events: none;
	}
	
	&:hover {
		border-color: var(--slot-color, var(--border-glow));
		background: var(--bg-card-hover);
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		
		.card-icon {
			transform: scale(1.1);
			
			.icon-inner {
				animation: pulse-glow 1.5s ease-in-out infinite;
			}
		}
		
		.card-hint {
			opacity: 1;
		}
	}
	
	/* 槽位主题色 */
	&--attack { --slot-color: var(--element-fire); }
	&--skill { --slot-color: var(--element-thunder); }
	&--sprint { --slot-color: var(--element-ice); }
	&--inherit { --slot-color: var(--element-dark); }
	&--summon { --slot-color: var(--element-poison); }
	
	/* 已选状态 */
	&--selected {
		border-color: var(--slot-color);
		
		.card-icon {
			background: rgba(0, 0, 0, 0.6);
		}
		
		.icon-inner {
			opacity: 1;
		}
	}
}

/* 槽位名称标签 */
.slot-label {
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%) rotate(-90deg);
	transform-origin: center;
	font-family: var(--font-display);
	font-size: 10px;
	font-weight: 600;
	letter-spacing: 3px;
	text-transform: uppercase;
	color: var(--text-muted);
	white-space: nowrap;
	opacity: 0.4;
	writing-mode: horizontal-tb;
}

/* 图标 */
.card-icon {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: rgba(0, 0, 0, 0.4);
	border: 2px solid var(--slot-color, var(--accent-primary));
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 14px;
	transition: all var(--transition-normal);
	position: relative;
	
	/* 六边形内部 */
	.icon-inner {
		width: 24px;
		height: 24px;
		background: var(--slot-color, var(--accent-primary));
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
		opacity: 0.3;
		transition: opacity var(--transition-normal);
	}
	
	/* 环形装饰 */
	&::before {
		content: '';
		position: absolute;
		inset: -6px;
		border-radius: 50%;
		border: 1px dashed var(--slot-color, var(--accent-primary));
		opacity: 0.2;
		animation: rotate 20s linear infinite;
	}
}

@keyframes rotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

/* 槽位名称 */
.card-trigger {
	font-family: var(--font-display);
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: var(--text-secondary);
	margin-bottom: 8px;
}

/* 当前流派 */
.card-sect {
	font-family: var(--font-chinese);
	font-size: 15px;
	font-weight: 700;
	color: var(--slot-color, var(--accent-primary));
	text-align: center;
	min-height: 20px;
	
	&--empty {
		color: var(--text-muted);
		font-weight: 400;
		font-size: 12px;
	}
}

/* 点击提示 */
.card-hint {
	position: absolute;
	bottom: 8px;
	left: 50%;
	transform: translateX(-50%);
	font-family: var(--font-display);
	font-size: 9px;
	font-weight: 600;
	letter-spacing: 1px;
	text-transform: uppercase;
	color: var(--slot-color, var(--accent-primary));
	opacity: 0;
	transition: opacity var(--transition-normal);
	white-space: nowrap;
}

/* 角落装饰 */
.corner-deco {
	position: absolute;
	width: 12px;
	height: 12px;
	border: 1px solid var(--slot-color, var(--accent-primary));
	opacity: 0.3;
	
	&--tl {
		top: 8px;
		left: 8px;
		border-right: none;
		border-bottom: none;
	}
	
	&--tr {
		top: 8px;
		right: 8px;
		border-left: none;
		border-bottom: none;
	}
	
	&--bl {
		bottom: 8px;
		left: 8px;
		border-right: none;
		border-top: none;
	}
	
	&--br {
		bottom: 8px;
		right: 8px;
		border-left: none;
		border-top: none;
	}
}

/* 响应式 */
@media (max-width: 1024px) {
	.skill-card {
		width: 100%;
		flex-direction: row;
		justify-content: flex-start;
		gap: 16px;
		padding: 16px 20px;
		
		.card-icon {
			margin-bottom: 0;
		}
		
		.card-content {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}
		
		.slot-label {
			display: none;
		}
		
		.card-hint {
			position: static;
			transform: none;
		}
	}
}
</style>

<template>
	<div 
		:class="[
			'skill-card',
			`skill-card--${slotTypeClass}`,
			{ 'skill-card--selected': skillCardInfo.sect }
		]"
		@click="handleClick"
	>
		<!-- 角落装饰 -->
		<span class="corner-deco corner-deco--tl"></span>
		<span class="corner-deco corner-deco--tr"></span>
		<span class="corner-deco corner-deco--bl"></span>
		<span class="corner-deco corner-deco--br"></span>
		
		<!-- 侧边标签 -->
		<span class="slot-label">{{ skillCardInfo.triggerName }}</span>
		
		<!-- 图标 -->
		<div class="card-icon">
			<div class="icon-inner"></div>
		</div>
		
		<!-- 内容 -->
		<div class="card-content">
			<span class="card-trigger">{{ skillCardInfo.triggerName }}</span>
			<span 
				:class="['card-sect', { 'card-sect--empty': !skillCardInfo.sect }]"
			>
				{{ skillCardInfo.sect || '点击选择' }}
			</span>
		</div>
		
		<!-- 提示 -->
		<span class="card-hint">点击修改</span>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { SkillCardInfo } from '../../interfaces/SkillCardInfo.ts';
import { Trigger } from '../../interfaces/Trigger.ts';

const props = defineProps<{
	skillCardInfo: SkillCardInfo;
}>();

const emit = defineEmits<{
	(event: 'openDialog', value: Trigger): void;
}>();

/* 槽位类型映射 */
const slotTypeClass = computed(() => {
	const mapper: Record<Trigger, string> = {
		'普攻': 'attack',
		'技能': 'skill',
		'冲刺': 'sprint',
		'传承': 'inherit',
		'召唤': 'summon',
	};
	return mapper[props.skillCardInfo.triggerName];
});

const handleClick = () => {
	emit('openDialog', props.skillCardInfo.triggerName);
};
</script>