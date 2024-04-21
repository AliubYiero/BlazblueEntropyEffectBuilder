<style lang="scss" scoped>
.card {
	$font: 楷体, serif;
	
	// 容器
	&-container {
		display: flex;
	}
	
	// 技能触发位的名称, 如普攻, 技能...
	&-skill-trigger-name {
		$fontSize: 16px;
		
		writing-mode: vertical-lr;
		padding: 0 3px 0 0;
		align-self: center;
		margin-top: -$fontSize;
		font-size: $fontSize;
		font-style: italic;
		font-family: $font;
		color: #5d5d5d;
		//border: 1px solid red;
		
		user-select: none;
	}
	
	// 承载具体技能信息的容器
	&-info {
		$item-size: 100px;
		
		// 容器
		&-container {
			display: flex;
			flex-flow: column;
			justify-content: center;
			align-items: center;
			gap: 5px;
		}
		
		// 技能信息
		&-item {
			width: $item-size;
			height: $item-size;
			
			border: 1px solid saddlebrown;
			border-radius: 50%;
		}
		
		// 技能名
		&-name {
			$height: 20px;
			
			// 添加占位高度, 否则出现文本时会出现dom元素偏移
			height: $height;
			font-size: $height;
			font-family: $font;
			color: #333333;
		}
	}
}
</style>

<template>
	<div class="card-container">
		<aside class="card-skill-trigger-name">
			{{ skillCardInfo.triggerName }}
		</aside>
		<main class="card-info-container"
		      @click="handleChangeSkillCardInfo"
		>
			<el-image
				class="card-info-item"
			>
				<template #error>
					<span></span>
				</template>
			</el-image>
			<span class="card-info-name">
			{{ skillCardInfo.sect }}
		</span>
		</main>
	</div>
	
	<el-dialog
		v-model="isShowDialog"
		center
		title="修改技能流派"
		width="500"
	>
		<change-skill-sect-form
			:trigger-name="skillCardInfo.triggerName"
			@close-dialog="closeDialog"
		/>
	</el-dialog>
</template>

<script lang="ts" setup>
import { SkillCardInfo } from '../../interfaces/SkillCardInfo.ts';
import { ref } from 'vue';
import ChangeSkillSectForm from './ChangeSkillSectForm.vue';

/**
 * 定义参数
 * */
defineProps<{
	skillCardInfo: SkillCardInfo,
}>();

/**
 * 作用域: 重置当前技能卡片
 * */
const useReChangeSkillCard = () => {
	const handleChangeSkillCardInfo = ( e: MouseEvent ) => {
		// 点击文字时不开启对话框
		const target = e.target as HTMLElement;
		if ( target.classList.contains( 'card-info-name' ) ) {
			return;
		}
		
		openDialog();
	};
	return {
		handleChangeSkillCardInfo,
	};
};
let {
	handleChangeSkillCardInfo,
} = useReChangeSkillCard();


/**
 * 作用域: 控制对话框显示状态
 * */
const useDialogShowStatus = () => {
	const isShowDialog = ref( false );
	
	const openDialog = () => {
		isShowDialog.value = true;
	};
	const closeDialog = () => {
		isShowDialog.value = false;
	};
	return {
		isShowDialog,
		openDialog,
		closeDialog,
	};
};
let {
	isShowDialog,
	openDialog,
	closeDialog,
} = useDialogShowStatus();

</script>
