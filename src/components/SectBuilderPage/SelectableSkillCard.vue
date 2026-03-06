<script lang="ts" setup>
import { computed } from 'vue';
import type { SkillCardInfo } from '../../domains/builder/types.ts';
import { useBuilderStore } from '../../domains/builder/index.ts';
import { getSkillInfoList } from '../../domains/skill/repository.ts';
import { triggerList } from '../../domains/config/index.ts';
import type { Trigger } from '../../interfaces/Trigger.ts';
import SkillCard from '../Public/SkillCard.vue';

const props = defineProps<{ skillCardInfo: SkillCardInfo }>();
const builderStore = useBuilderStore();

const occupiedTriggers = computed<Set<Trigger>>( () => {
	const occupied = new Set<Trigger>();
	for ( const trigger of triggerList ) {
		if ( builderStore.getCheckboxState( trigger ) === 'checked' ) {
			occupied.add( trigger );
		}
	}
	return occupied;
} );

const filterDetailList = computed( () => {
	const skillInfoList = getSkillInfoList().value;
	let list = skillInfoList.filter( skill =>
		props.skillCardInfo.sect && ( skill.mainSect.includes( props.skillCardInfo.sect ) || skill.secondSect.includes( props.skillCardInfo.sect ) ),
	);
	const existing = builderStore.skillCardInfoList.filter( c => c.sect || c.inherit ).map( c => c.triggerName );
	const inheritedNames = new Set(
		builderStore.skillCardInfoList
			.filter( c => c.inheritSkill )
			.map( c => c.inheritSkill!.name ),
	);
	return list
		.filter( skill =>
			!inheritedNames.has( skill.name ) &&
			skill.trigger.some( t => !existing.includes( t ) ),
		)
		.map( skill => ( {
			skill,
			availableTriggers: skill.trigger.filter( t => !occupiedTriggers.value.has( t ) ),
		} ) )
		.filter( item => item.availableTriggers.length > 0 );
} );
</script>

<template>
	<div class="selectable-container">
		<div v-if="filterDetailList.length === 0" class="empty-state">
			选择流派后显示可组合的双重策略
		</div>
		
		<div v-else class="skills-grid">
			<SkillCard
				v-for="item in filterDetailList"
				:key="item.skill.name"
				:show-tooltip="true"
				:show-triggers="true"
				:skill="item.skill"
				:triggers="item.availableTriggers"
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
