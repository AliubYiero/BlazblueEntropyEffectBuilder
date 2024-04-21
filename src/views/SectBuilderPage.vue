<style lang="scss" scoped>
.skill-card {
	&-container {
		display: flex;
		flex-flow: column;
		gap: 20px;
		justify-content: center;
	}
	
	&-item {
		display: flex;
		gap: 20px;
	}
}
</style>

<template>
	<main class="skill-card-container">
		<enabled-double-skill/>
		<el-divider/>
		<section v-for="skillCardInfo in skillCardInfoList"
		         class="skill-card-item">
			<skill-card :skillCardInfo="skillCardInfo"/>
			<selectable-skill-card
				:skillCardInfo="skillCardInfo"/>
		</section>
	</main>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import SkillCard from '../components/SectBuilderPage/SkillCard.vue';
import {
	SkillCardInfoTuple,
} from '../interfaces/SkillCardInfoTuple.ts';
import {
	useSkillCardInfoStore,
} from '../store/useSkillCardInfoStore.ts';
import SelectableSkillCard
	from '../components/SectBuilderPage/SelectableSkillCard.vue';
import EnabledDoubleSkill
	from '../components/SectBuilderPage/EnabledDoubleSkill.vue';

/**
 * 作用域: 获取技能卡片信息
 * */
const useMatchSkillCardInfo = () => {
	const skillCardInfoList = computed<SkillCardInfoTuple>( () => useSkillCardInfoStore().skillCardInfoList );
	return {
		skillCardInfoList,
	};
};
const { skillCardInfoList } = useMatchSkillCardInfo();

</script>
