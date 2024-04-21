<!--
  -- EnabledDoubleSkill.vue
  --
  -- created by 2024/4/22
  -- @file 可以被激活的双重技能显示容器
  -- @author  Yiero
  -- -->
<style lang="scss" scoped>
.selectable-double-skill {
	&-form {
		display: flex;
		gap: 20px;
	}
	
	&-conainer {
		display: flex;
		flex-flow: column;
		gap: 5px;
	}
	
	&-item {
		display: flex;
		gap: 20px;
	}
}
</style>

<template>
	<main class="selectable-double-skill-container">
		<!-- 当前触发位已存在继承双重 -->
		<section class="selectable-double-skill-form">
			<!-- 普攻筛选多选框 -->
			<el-form-item class="attack-trigger-form-item">
				<el-checkbox
					v-model="isCheckAttack"
					label="普攻"
				/>
			</el-form-item>
			
			<!-- 技能筛选多选框 -->
			<el-form-item class="kill-trigger-form-item">
				<el-checkbox
					v-model="isCheckSkill"
					label="技能"
				/>
			</el-form-item>
			
			<!-- 冲刺筛选多选框 -->
			<el-form-item class="sprint-trigger-form-item">
				<el-checkbox
					v-model="isCheckSprint"
					label="冲刺"
				/>
			</el-form-item>
			
			<!-- 召唤筛选多选框 -->
			<el-form-item class="call-trigger-form-item">
				<el-checkbox
					v-model="isCheckCall"
					label="召唤"
				/>
			</el-form-item>
			
			<!-- 传承技筛选多选框 -->
			<el-form-item
				class="inheriting-trigger-form-item">
				<el-checkbox
					v-model="isCheckInheriting"
					label="传承"
				/>
			</el-form-item>
		</section>
		<section
			v-for="selectableDoubleSkill in selectableDoubleSkillList"
			class="selectable-double-skill-item">
			<p class="selectable-double-skill-text selectable-double-skill-name">
				{{ selectableDoubleSkill.name }}
			</p>
			<p class="selectable-double-skill-text selectable-double-skill-main-sect">
				{{ selectableDoubleSkill.mainSect }}
			</p>
			<p class="selectable-double-skill-text selectable-double-skill-second-sect">
				{{ selectableDoubleSkill.secondSect }}
			</p>
			<p class="selectable-double-skill-text selectable-double-skill-description">
				{{ selectableDoubleSkill.description }}
			</p>
		</section>
	</main>
</template>

<script lang="ts" setup>

/*
* 1. 获取当前已选择流派
* */
import { computed } from 'vue';
import {
	SkillInfoInterface,
} from '../../interfaces/SkillInfoInterface.ts';
import {
	useSkillCardInfoStore,
} from '../../store/useSkillCardInfoStore.ts';
import { SectValue } from '../../interfaces/SectValue.ts';
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { SkillCardInfo } from '../../interfaces/SkillCardInfo.ts';


/**
 * 作用域: 确认是否存在继承的双重
 * */
const useInheritDoubleSkill = () => {
	const skillCardInfoStore = useSkillCardInfoStore();
	const isCheckAttack = computed( {
		get: () => ( <SkillCardInfo> skillCardInfoStore.skillCardInfoList.find( item => item.triggerName === '普攻' ) ).inherit,
		set: ( value: boolean ) => {skillCardInfoStore.updateSkillCardInfoInherit( '普攻', value );},
	} );
	const isCheckSkill = computed( {
		get: () => ( <SkillCardInfo> skillCardInfoStore.skillCardInfoList.find( item => item.triggerName === '技能' ) ).inherit,
		set: ( value: boolean ) => {skillCardInfoStore.updateSkillCardInfoInherit( '技能', value );},
	} );
	const isCheckSprint = computed( {
		get: () => ( <SkillCardInfo> skillCardInfoStore.skillCardInfoList.find( item => item.triggerName === '冲刺' ) ).inherit,
		set: ( value: boolean ) => {skillCardInfoStore.updateSkillCardInfoInherit( '冲刺', value );},
	} );
	const isCheckCall = computed( {
		get: () => ( <SkillCardInfo> skillCardInfoStore.skillCardInfoList.find( item => item.triggerName === '召唤' ) ).inherit,
		set: ( value: boolean ) => {skillCardInfoStore.updateSkillCardInfoInherit( '召唤', value );},
	} );
	const isCheckInheriting = computed( {
		get: () => ( <SkillCardInfo> skillCardInfoStore.skillCardInfoList.find( item => item.triggerName === '传承' ) ).inherit,
		set: ( value: boolean ) => {skillCardInfoStore.updateSkillCardInfoInherit( '传承', value );},
	} );
	return {
		isCheckAttack,
		isCheckSkill,
		isCheckSprint,
		isCheckCall,
		isCheckInheriting,
	};
};
let {
	isCheckAttack,
	isCheckCall,
	isCheckInheriting,
	isCheckSkill,
	isCheckSprint,
} = useInheritDoubleSkill();

/**
 * 作用域: 计算可以被激活的双重技能
 * */
const useGetSelectableDoubleSkill = () => {
	const skillInfoStore = useSkillInfoStore();
	const skillCardInfoStore = useSkillCardInfoStore();
	// 获取当前已选择的流派
	const sectList = computed<SectValue[]>( () => skillCardInfoStore.skillCardInfoList
		.filter( skillCardInfo => skillCardInfo.sect )
		.map( skillCardInfo => skillCardInfo.sect ) as SectValue[],
	);
	
	
	const selectableDoubleSkillList = computed<SkillInfoInterface[]>( () => {
		return skillInfoStore.skillInfoList.filter( skillInfo =>
			sectList.value.includes( skillInfo.mainSect ) && sectList.value.includes( skillInfo.secondSect ),
		);
	} );
	
	return {
		selectableDoubleSkillList,
	};
};
let {
	selectableDoubleSkillList,
} = useGetSelectableDoubleSkill();
</script>
