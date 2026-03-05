<script lang="ts" setup>
import { computed } from 'vue';
import type { SkillCardInfo } from '../../domains/builder/types.ts';
import { useBuilderStore } from '../../domains/builder/index.ts';
import { getSkillInfoList } from '../../domains/skill/repository.ts';
import type { SkillInfo } from '../../core/data/types.ts';
import SkillCard from '../Public/SkillCard.vue';

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
</script>

<template>
	<div class="selectable-container">
		<div v-if="filterDetailList.length === 0" class="empty-state">
			选择流派后显示可组合的双重策略
		</div>
		
		<div v-else class="skills-grid">
			<SkillCard
				v-for="detail in filterDetailList"
				:key="detail.name"
				:show-tooltip="true"
				:show-triggers="true"
				:skill="detail"
				size="compact"
			/>
		</div>
	</div>
</template>

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
	border: 1px dashed var(--border);
	border-radius: var(--radius);
	color: var(--muted-foreground);
}

.skills-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	gap: 8px;
}
</style>
