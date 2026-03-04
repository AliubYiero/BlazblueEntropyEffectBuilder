<style lang="scss" scoped>
.selectable-container {
	flex: 1;
	min-width: 0;
}

.empty-state {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32px;
	border: 1px dashed hsl(var(--border));
	border-radius: var(--radius);
	color: hsl(var(--muted-foreground));
}

.skills-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	gap: 8px;
}

.skill-item {
	background: hsl(var(--background));
	border: 1px solid hsl(var(--border));
	border-radius: calc(var(--radius) - 2px);
	padding: 10px 12px;
	cursor: pointer;
	transition: all 0.15s ease;
	
	&:hover {
		border-color: hsl(var(--ring));
		background: hsl(var(--accent) / 0.3);
	}
}

.item-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 6px;
}

.skill-name {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 500;
	color: hsl(var(--foreground));
}

.sect-combo {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-bottom: 4px;
}

.sect-tag {
	display: flex;
	align-items: center;
	gap: 4px;
	font-family: var(--font-chinese);
	font-size: 11px;
	color: hsl(var(--foreground));
}

.sect-connector {
	color: hsl(var(--muted-foreground));
	font-size: 10px;
}

.skill-desc {
	font-family: var(--font-chinese);
	font-size: 11px;
	color: hsl(var(--muted-foreground));
}
</style>

<template>
	<div class="selectable-container">
		<div v-if="filterDetailList.length === 0" class="empty-state">
			选择流派后显示可组合的双重策略
		</div>
		
		<div v-else class="skills-grid">
			<div v-for="detail in filterDetailList" :key="detail.name"
			     class="skill-item">
				<div class="item-header">
					<span class="skill-name">{{ detail.name }}</span>
				</div>
				<div class="sect-combo">
					<span class="sect-tag">
						<span
							:class="['element-dot', `element-dot--${styleMapper[detail.mainAttribute]}`]"></span>
						<template v-if="getSkillDisplay(detail.mainSect)">
							<el-tooltip
								:content="getSkillDisplay(detail.mainSect)"
								placement="top">
								{{ detail.mainSect }}
							</el-tooltip>
						</template>
						<template v-else>
							{{ detail.mainSect }}
						</template>
					</span>
					<span class="sect-connector">+</span>
					<span class="sect-tag">
						<span
							:class="['element-dot', `element-dot--${styleMapper[detail.secondAttribute]}`]"></span>
						<template v-if="getSkillDisplay(detail.secondSect)">
							<el-tooltip
								:content="getSkillDisplay(detail.secondSect)"
								placement="top">
								{{ detail.secondSect }}
							</el-tooltip>
						</template>
						<template v-else>
							{{ detail.secondSect }}
						</template>
					</span>
				</div>
				<p class="skill-desc">{{ detail.description }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { SkillCardInfo } from '../../domains/builder/types.ts';
import { useBuilderStore } from '../../domains/builder/index.ts';
import { getSkillInfoList } from '../../domains/skill/repository.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import { getSkillsBySect } from '../../domains/config/index.ts';
import type { SkillInfo } from '../../core/data/types.ts';

const props = defineProps<{ skillCardInfo: SkillCardInfo }>();
const builderStore = useBuilderStore();

const filterDetailList = computed<SkillInfo[]>( () => {
	const skillInfoList = getSkillInfoList().value;
	let list = skillInfoList.filter( skill =>
		props.skillCardInfo.sect && ( skill.mainSect.includes( props.skillCardInfo.sect ) || skill.secondSect.includes( props.skillCardInfo.sect ) ),
	);
	const existing = builderStore.skillCardInfoList.filter( c => c.sect || c.inherit ).map( c => c.triggerName );
	return list.filter( skill => skill.trigger.some( t => !existing.includes( t ) ) );
} );

const styleMapper: Record<Attribute, string> = {
	'火': 'fire', '冰': 'ice', '电': 'thunder',
	'毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};

const getSkillDisplay = ( sectName: string ): string => {
	return getSkillsBySect( sectName );
};
</script>
