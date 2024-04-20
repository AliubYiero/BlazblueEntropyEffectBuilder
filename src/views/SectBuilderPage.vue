<style lang="scss" scoped>
.skill-card {
	&-container {
		display: flex;
		flex-flow: column;
		gap: 20px;
		justify-content: center;
	}
}
</style>

<template>
	<main class="skill-card-container">
		<section v-for="skillCardInfo in skillCardInfoList"
		         class="skill-card-item">
			<skill-card :skillCardInfo="skillCardInfo"/>
		</section>
	</main>
</template>

<script lang="ts" setup>
import { computed, ComputedRef } from 'vue';
import SkillCard from '../components/SectBuilderPage/SkillCard.vue';
import {
	SkillCardInfoTuple,
} from '../interfaces/SkillCardInfoTuple.ts';
import {
	useSkillCardInfoStore,
} from '../store/useSkillCardInfoStore.ts';

const skillCardInfoList: ComputedRef<SkillCardInfoTuple> = computed( () => useSkillCardInfoStore().skillCardInfoList );
</script>
