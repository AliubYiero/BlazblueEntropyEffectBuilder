<style lang="scss" scoped>
.skill-card {
	position: relative;
	flex-shrink: 0;
	width: 120px;
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	padding: 16px;
	display: flex;
	gap: 8px;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	text-align: center;
	transition: all 0.15s ease;
	
	&:hover {
		border-color: var(--ring);
		background: hsl(from var(--accent) h s l / 0.3);
	}
}

.clear-btn {
	position: absolute;
	top: 8px;
	right: 8px;
	opacity: 0.6;
	transition: opacity 0.15s ease;
	
	&:hover {
		opacity: 1;
	}
}

.card-icon {
	$cardIconSize: 30px;
	width: $cardIconSize;
	height: $cardIconSize;
	border-radius: 50%;
	background: var(--secondary);
	border: 2px solid var(--border);
	display: flex;
	align-items: center;
	justify-content: center;
	
	.icon-inner {
		width: 16px;
		height: 16px;
		background: var(--muted-foreground);
		border-radius: 50%;
	}
}

.card-icon__element {
	font-size: 16px;
}

.card-trigger {
	font-family: var(--font-chinese);
	font-size: 12px;
	font-weight: 500;
	color: var(--muted-foreground);
	margin-bottom: 4px;
}

.card-sect {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 500;
	color: var(--foreground);
	
	&--empty {
		color: var(--muted-foreground);
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
		<el-icon
			v-if="skillCardInfo.sect"
			class="clear-btn"
			@click.stop="handleClear"
		>
			<CircleClose/>
		</el-icon>
		<div class="card-icon" :style="cardIconStyle">
			<ElementIcon
				v-if="element"
				:element="element"
				class="card-icon__element"
			/>
			<div v-else class="icon-inner"></div>
		</div>
		<div class="skill-card-content">
			<span class="card-trigger">{{ skillCardInfo.triggerName }}</span>
			<br>
			<span
				:class="['card-sect', { 'card-sect--empty': !skillCardInfo.sect }]">
				{{ skillCardInfo.skillName || '点击选择' }}
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { SkillCardInfo } from '../../domains/builder/types.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import { useBuilderStore } from '../../domains/builder/index.ts';
import { getAttributeBySect, styleMapper } from '../../domains/config/index.ts';
import { CircleClose } from '@element-plus/icons-vue';
import ElementIcon from '../Icon/ElementIcon.vue';

const props = defineProps<{ skillCardInfo: SkillCardInfo }>();
const emit = defineEmits<{ ( event: 'openDialog', value: Trigger ): void }>();

const builderStore = useBuilderStore();

/** 根据已选流派反查元素（未选时为 undefined） */
const element = computed( () => getAttributeBySect( props.skillCardInfo.sect ) );

/** 元素的 CSS key（fire/ice/thunder/...），用于元素色变量 */
const cssKey = computed( () => ( element.value ? styleMapper[ element.value ] : '' ) );

/** 卡片图标区样式：选中后圆形底色淡染元素色 */
const cardIconStyle = computed( () => {
	if ( !cssKey.value ) return {};
	return { background: `hsl(from var(--element-${cssKey.value}) h s l / 0.15)` };
} );

const handleClick = () => emit( 'openDialog', props.skillCardInfo.triggerName );

/**
 * 清除流派选择
 * */
const handleClear = () => {
	builderStore.updateSkillCardInfo( props.skillCardInfo.triggerName, '' );
};
</script>
