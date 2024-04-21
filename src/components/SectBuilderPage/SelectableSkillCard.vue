<!--
  -- SelectableSkillCard.vue
  --
  -- created by 2024/4/21
  -- @file 可被选择的技能卡片
  -- @author  Yiero
  -- -->
<style lang="scss" scoped>
.detail {
	// 内容容器
	&-container {
		display: flex;
		flex-flow: column;
	}
	
	// 内容项
	&-item {
		display: flex;
		gap: 20px;
		padding: 0;
		
		&-text {
			margin: 0;
		}
		
		&-text:not(.detail-double-skill-description) {
			width: 100px;
		}
		
		// 当前激活的流派
		&-active-sect {
			color: #cccccc;
		}
		
		// 等待激活的流派 / 属性
		&-selectable {
			color: #ff5757;
		}
	}
}
</style>

<template>
	<main class="detail-container">
		<section v-for="detail in filterDetailList"
		         class="detail-item">
			<p class="detail-item-text detail-attribute detail-item-selectable">
				{{
					detail.mainSect.includes( skillCardInfo.sect )
						? detail.secondAttribute
						: detail.mainAttribute
				}}</p>
			<p :class="detail.mainSect.includes(skillCardInfo.sect)
			? 'detail-item-active-sect'
			: 'detail-item-selectable'"
			   class="detail-item-text detail-main-sect">
				{{
					detail.mainSect
				}}</p>
			<p :class="detail.secondSect.includes(skillCardInfo.sect)
			? 'detail-item-active-sect'
			: 'detail-item-selectable'"
			   class="detail-item-text detail-second-sect"
			>{{
					detail.secondSect
				}}</p>
			<p class="detail-item-text detail-double-skill-name">
				{{ detail.name }}</p>
			<p class="detail-item-text detail-double-skill-description">
				{{
					detail.description
				}}</p>
		</section>
	</main>
</template>

<script lang="ts" setup>
import { SkillCardInfo } from '../../interfaces/SkillCardInfo.ts';
import { computed } from 'vue';
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import {
	SkillInfoInterface,
} from '../../interfaces/SkillInfoInterface.ts';
import {
	useSkillCardInfoStore,
} from '../../store/useSkillCardInfoStore.ts';


/**
 * 定义传入参数
 * */
const { skillCardInfo } = defineProps<{
	skillCardInfo: SkillCardInfo
}>();

/**
 * 作用域: 计算当前触发位的可选择的技能列表
 * */
const useDetailSkillList = () => {
	const skillInfoStore = useSkillInfoStore();
	const skillCardInfoStore = useSkillCardInfoStore();
	
	const filterDetailList = computed<SkillInfoInterface[]>( () => {
		// 先获取当前可使用的所有双重
		let selectableSkillInfoList = skillInfoStore.skillInfoList.filter( skillInfo => {
			const isContains = skillCardInfo.sect
				&& ( skillInfo.mainSect.includes( skillCardInfo.sect )
					|| skillInfo.secondSect.includes( skillCardInfo.sect ) );
			return isContains;
		} );
		
		// 将当前存在的流派变成数组
		const existTriggerList = skillCardInfoStore.skillCardInfoList
			.filter( skillCardInfo => skillCardInfo.sect || skillCardInfo.inherit )
			.map( skillCardInfo => skillCardInfo.triggerName );
		
		// 再过滤掉已经有的触发位
		selectableSkillInfoList = selectableSkillInfoList.filter( skillInfo => {
			
			let isNotConflict = Boolean( skillInfo.trigger.filter( trigger => {
				return !existTriggerList.includes( trigger );
			} ).length );
			
			return isNotConflict;
		} );
		
		return selectableSkillInfoList;
	} );
	return {
		filterDetailList,
	};
};
let {
	filterDetailList,
} = useDetailSkillList();
</script>
