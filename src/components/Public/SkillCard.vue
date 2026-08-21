<script lang="ts" setup>
import { computed } from 'vue';
import type { DualStrategyInfo } from '../../core/data/types.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import { getSkillsBySect, styleMapper } from '../../domains/config/index.ts';
import { getStrategySectPair } from '../../domains/skill/index.ts';

interface Props {
	skill: DualStrategyInfo;
	size?: 'compact' | 'normal';
	showTriggers?: boolean;
	showTooltip?: boolean;
	clickable?: boolean;
	triggers?: Trigger[];
	trigger?: Trigger;
}

const props = withDefaults( defineProps<Props>(), {
	size: 'normal',
	showTriggers: true,
	showTooltip: true,
	clickable: false,
} );

const displayTriggers = computed( () => {
	if ( props.showTriggers && props.trigger ) {
		return [ props.trigger ];
	}
	return props.triggers ?? props.skill.triggerSlots;
} );

// Q10：派生 helper 放 repository，组件保持薄
const sectPair = computed( () => getStrategySectPair( props.skill ) );

const emit = defineEmits<{
	( e: 'click', skill: DualStrategyInfo ): void;
}>();

const handleClick = () => {
	if ( props.clickable ) {
		emit( 'click', props.skill );
	}
};

const getSkillDisplay = ( sectName: string ): string => {
	const skills = getSkillsBySect( sectName );
	return Array.isArray( skills ) ? skills.join( '、' ) : skills;
};

const getElementDotClass = ( attribute: Attribute ): string => {
	return styleMapper[ attribute ] || 'default';
};
</script>

<template>
	<div
		:class="[`skill-card--${size}`, { 'skill-card--clickable': clickable }]"
		class="skill-card"
		@click="handleClick"
	>
		<div class="skill-card__header">
			<h3 class="skill-card__name">{{ skill.name }}</h3>
			<div v-if="showTriggers && displayTriggers.length > 0"
			     class="skill-card__triggers">
        <span v-for="trigger in displayTriggers" :key="trigger"
              class="trigger-badge">
          {{ trigger }}
        </span>
			</div>
		</div>
		
		<div class="skill-card__sects">
			<div class="sect-item">
				<span
					:class="['element-dot', `element-dot--${getElementDotClass(sectPair.primaryAttribute)}`]"></span>
				<template
					v-if="showTooltip && getSkillDisplay(sectPair.primaryStyle)">
					<el-tooltip
						:content="getSkillDisplay(sectPair.primaryStyle)"
						placement="top">
						<span class="sect-name">{{
								sectPair.primaryStyle
							}}</span>
					</el-tooltip>
				</template>
				<template v-else>
					<span class="sect-name">{{ sectPair.primaryStyle }}</span>
				</template>
			</div>
			<span class="sect-connector">+</span>
			<div class="sect-item">
				<span
					:class="['element-dot', `element-dot--${getElementDotClass(sectPair.secondaryAttribute)}`]"></span>
				<template
					v-if="showTooltip && getSkillDisplay(sectPair.secondaryStyle)">
					<el-tooltip
						:content="getSkillDisplay(sectPair.secondaryStyle)"
						placement="top">
						<span class="sect-name">{{
								sectPair.secondaryStyle
							}}</span>
					</el-tooltip>
				</template>
				<template v-else>
					<span class="sect-name">{{ sectPair.secondaryStyle }}</span>
				</template>
			</div>
		</div>
		
		<p class="skill-card__desc">{{ skill.description }}</p>
	</div>
</template>

<style lang="scss" scoped>
.skill-card {
	background: var(--card);
	border: 1px solid var(--border);
	border-radius: var(--radius);
	transition: all 0.15s ease;
	
	&:hover {
		border-color: var(--ring);
		background: hsl(from var(--accent) h s l / 0.3);
	}
}

.skill-card--normal {
	padding: 16px;
	
	.skill-card__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 12px;
	}
	
	.skill-card__name {
		font-family: var(--font-chinese);
		font-size: 14px;
		font-weight: 600;
		color: var(--foreground);
	}
	
	.skill-card__triggers {
		display: flex;
		gap: 4px;
	}
	
	.trigger-badge {
		font-family: var(--font-chinese);
		font-size: 11px;
		font-weight: 500;
		padding: 2px 8px;
		border-radius: calc(var(--radius) - 4px);
		background: var(--secondary);
		color: var(--secondary-foreground);
	}
	
	.skill-card__sects {
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
		color: var(--foreground);
	}
	
	.sect-connector {
		color: var(--muted-foreground);
		font-size: 12px;
	}
	
	.skill-card__desc {
		font-family: var(--font-chinese);
		font-size: 13px;
		line-height: 1.5;
		color: var(--muted-foreground);
		padding-top: 8px;
		border-top: 1px solid var(--border);
	}
}

.skill-card--compact {
	padding: 10px 12px;
	
	.skill-card__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 6px;
	}
	
	.skill-card__name {
		font-family: var(--font-chinese);
		font-size: 13px;
		font-weight: 500;
		color: var(--foreground);
	}
	
	.skill-card__triggers {
		display: flex;
		gap: 4px;
	}
	
	.trigger-badge {
		font-family: var(--font-chinese);
		font-size: 10px;
		font-weight: 500;
		padding: 2px 6px;
		border-radius: calc(var(--radius) - 4px);
		background: var(--secondary);
		color: var(--secondary-foreground);
	}
	
	.skill-card__sects {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 4px;
	}
	
	.sect-item {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	
	.sect-name {
		font-family: var(--font-chinese);
		font-size: 11px;
		color: var(--foreground);
	}
	
	.sect-connector {
		color: var(--muted-foreground);
		font-size: 10px;
	}
	
	.skill-card__desc {
		font-family: var(--font-chinese);
		font-size: 11px;
		color: var(--muted-foreground);
		line-height: 1.4;
	}
}

.skill-card--clickable {
	cursor: pointer;
}
</style>
