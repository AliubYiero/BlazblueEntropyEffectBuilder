<style lang="scss" scoped>
.selectable-container {
	flex: 1;
	min-width: 0;
}

.empty-state {
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
	max-width: 180px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
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
			<div v-for="detail in filterDetailList" :key="detail.name" class="skill-item">
				<div class="item-header">
					<span class="skill-name">{{ detail.name }}</span>
				</div>
				<div class="sect-combo">
					<span class="sect-tag">
						<span :class="['element-dot', `element-dot--${styleMapper[detail.mainAttribute]}`]"></span>
						{{ getSkillDisplay(detail.mainSect) }}
					</span>
					<span class="sect-connector">+</span>
					<span class="sect-tag">
						<span :class="['element-dot', `element-dot--${styleMapper[detail.secondAttribute]}`]"></span>
						{{ getSkillDisplay(detail.secondSect) }}
					</span>
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
import { getSkillsBySect } from '../../config/sectConfig.ts';

const props = defineProps<{ skillCardInfo: SkillCardInfo }>();
const skillInfoStore = useSkillInfoStore();
const skillCardInfoStore = useSkillCardInfoStore();

const filterDetailList = computed<SkillInfoInterface[]>(() => {
	let list = skillInfoStore.skillInfoList.filter(skill =>
		props.skillCardInfo.sect && (skill.mainSect.includes(props.skillCardInfo.sect) || skill.secondSect.includes(props.skillCardInfo.sect))
	);
	const existing = skillCardInfoStore.skillCardInfoList.filter(c => c.sect || c.inherit).map(c => c.triggerName);
	return list.filter(skill => skill.trigger.some(t => !existing.includes(t)));
});

const styleMapper: Record<Attribute, string> = {
	'火': 'fire', '冰': 'ice', '电': 'thunder',
	'毒': 'poison', '暗': 'dark', '光': 'light', '刃': 'blade',
};

const getSkillDisplay = (sectName: string): string => {
	return getSkillsBySect(sectName);
};
</script>
