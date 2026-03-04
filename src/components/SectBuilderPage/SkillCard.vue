<style lang="scss" scoped>
.skill-card {
	flex-shrink: 0;
	width: 120px;
	background: hsl(var(--card));
	border: 1px solid hsl(var(--border));
	border-radius: var(--radius);
	padding: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	text-align: center;
	transition: all 0.15s ease;
	
	&:hover {
		border-color: hsl(var(--ring));
		background: hsl(var(--accent) / 0.3);
	}
}

.card-icon {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background: hsl(var(--secondary));
	border: 2px solid hsl(var(--border));
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 12px;
	
	.icon-inner {
		width: 16px;
		height: 16px;
		background: hsl(var(--muted-foreground));
		border-radius: 50%;
	}
}

.card-trigger {
	font-family: var(--font-chinese);
	font-size: 12px;
	font-weight: 500;
	color: hsl(var(--muted-foreground));
	margin-bottom: 4px;
}

.card-sect {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 500;
	color: hsl(var(--foreground));
	
	&--empty {
		color: hsl(var(--muted-foreground));
		font-weight: 400;
	}
}

@media (max-width: 768px) {
	.skill-card {
		width: 100%;
		flex-direction: row;
		justify-content: flex-start;
		gap: 12px;
		
		.card-icon {
			margin-bottom: 0;
		}
	}
}
</style>

<template>
	<div class="skill-card" @click="handleClick">
		<div class="card-icon">
			<div class="icon-inner"></div>
		</div>
		<div class="skill-card-content">
			<span class="card-trigger">{{ skillCardInfo.triggerName }}</span>
			<br>
			<span
				:class="['card-sect', { 'card-sect--empty': !skillCardInfo.sect }]">
				{{ skillCardInfo.sect ? skillCardInfo.sect : '点击选择' }}
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { SkillCardInfo } from '../../domains/builder/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import { useBuilderStore } from '../../domains/builder/index.ts';
import { CircleClose } from '@element-plus/icons-vue';

const props = defineProps<{ skillCardInfo: SkillCardInfo }>();
const emit = defineEmits<{ ( event: 'openDialog', value: Trigger ): void }>();

const handleClick = () => emit( 'openDialog', props.skillCardInfo.triggerName );
</script>
