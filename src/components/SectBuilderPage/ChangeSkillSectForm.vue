<style lang="scss" scoped>
.changer-form {
	// 输入项
	&-item {
		display: flex;
		//gap: 10px;
		align-items: center;
	}
	
	/*
	输入表单
	*/
	&-attribute-input {
		width: 100px;
	}
}
</style>

<template>
	<el-form ref="formRef"
	         :model="formData"
	         :rules="rules"
	         class="changer-form-container"
	         label-width="auto"
	>
		<!-- 触发位 -->
		<el-form-item
			class="changer-form-item trigger-input-container"
			label="触发位:"
			prop="formData.triggerName"
		>
			<el-select v-model="formData.triggerName"
			           class="changer-form-input changer-form-trigger-input"
			           disabled
			           placeholder="请选择流派"
			>
				<el-option
					v-for="triggerOption in triggerOptionList"
					:value="triggerOption"
				/>
			</el-select>
		</el-form-item>
		
		<!-- 流派 / 属性 -->
		<el-form-item
			class="changer-form-item"
			label="流派:"
			prop="formData.sect"
		>
			<!-- 流派 -->
			<el-autocomplete
				v-model="formData.sect"
				:fetch-suggestions="fetchSectListSuggestions"
				class="changer-form-input changer-form-sect-input"
				clearable
				placeholder="请输入流派"
				style="flex: 1; margin: 0 5px 0 0;"
			/>
			
			<!-- 属性 -->
			<el-select
				v-model="formData.attribute"
				class="changer-form-input changer-form-attribute-input"
				placeholder="选择属性"
			>
				<el-option v-for="attribute in attributeList"
				           :key="attribute"
				           :value="attribute"
				></el-option>
			</el-select>
		</el-form-item>
		
		<!-- 确定按钮 / 关闭按钮 -->
		<el-form-item
			class="changer-form-item submit-btn-group-input-container"
		>
			<!-- 确定按钮 / 关闭按钮 -->
			<el-button type="primary"
			           @click="handleSubmitForm"
			>
				确定
			</el-button>
			<el-button @click="handleEmitCloseDialog">
				取消
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { Trigger } from '../../interfaces/Trigger.ts';
import { computed, reactive, ref, watch } from 'vue';
import { sectConfig } from '../../config/sectConfig.ts';
import { Attribute } from '../../interfaces/Attribute.ts';
import { SectValue } from '../../interfaces/SectValue.ts';
import { Sect } from '../../interfaces/Sect.ts';
import { EmptyStringAble } from '../../interfaces/Nullable.ts';
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { FormInstance } from 'element-plus';
import {
	useSkillCardInfoStore,
} from '../../store/useSkillCardInfoStore.ts';

/**
 * 定义参数
 * */
const props = defineProps<{
	triggerName: Trigger,
}>();

/**
 * 定义传出事件
 * */
const emits = defineEmits<{
	( event: 'closeDialog', value: void ): void;
}>();

/**
 * 作用域: 输入表单操作
 * */
const useFormOperator = () => {
	interface FormData {
		triggerName: Trigger;
		attribute: EmptyStringAble<Attribute>;
		sect: EmptyStringAble<SectValue>;
	}
	
	/*
	* 表单数据
	* */
	const formData = reactive<FormData>( {
		triggerName: props.triggerName,
		attribute: '',
		sect: '',
	} );
	
	/*
	* 触发位
	* */
	/** 触发位列表 */
	const triggerOptionList: Trigger[] = [ '普攻', '技能', '冲刺', '传承', '召唤' ] as const;
	
	/**
	 * 根据输入的 Sect 获取流派对应的属性
	 * */
	const getAttribute = ( sect: SectValue ): EmptyStringAble<Attribute> => {
		for ( let sectConfigKey in sectConfig ) {
			const attribute = sectConfigKey as Attribute;
			const singleSectList = sectConfig[ <keyof Sect> sectConfigKey ];
			
			const inCurrentSect = singleSectList.includes( sect );
			if ( inCurrentSect ) {
				return attribute;
			}
		}
		return '';
	};
	
	/*
	* 属性/流派更改监听
	* */
	watch( formData, () => {
		/*
		* 监听 formData.attribute 的更改, 进行对应的响应式拦截
		*
		* 如果 formData.sect (流派) 有值, 不允许修改;
		* 当 formData.sect 更改时, 将 formData.attribute 修改为对应的流派;
		* */
		if ( formData.sect ) {
			// 因为引用对象被更改无法直接获取旧的修改值, 所以这里是重新获取了当前流派的对应属性
			formData.attribute = getAttribute( formData.sect );
		}
	} );
	
	/** 获取包含所有属性的数组 */
	const attributeList = Array.from( Object.keys( sectConfig ) );
	
	/**
	 * 句柄: 过滤掉不属于当前触发位的 SectList
	 * */
	const handleFilterSectList = ( sectList: SectValue[] ) => {
		return sectList.filter( ( sect ) => {
			const triggerInfoList = useSkillInfoStore().triggerInfoList;
			const currentSectTriggerInfo = triggerInfoList.find( item => item.name === sect );
			if ( !currentSectTriggerInfo ) {
				return false;
			}
			return currentSectTriggerInfo.trigger.includes( props.triggerName );
		} );
	};
	/** 显示给用户的流派列表 */
	const filterSectList = computed( () => {
		let sectList: SectValue[] = handleFilterSectList( <SectValue[]> Array.from( Object.values( sectConfig ) ).flat() );
		if ( formData.attribute ) {
			sectList = handleFilterSectList( <SectValue[]> sectConfig[ formData.attribute ] );
		}
		return sectList;
	} );
	/**
	 * 获取当前所有预选流派
	 * */
	const fetchSectListSuggestions = () => {
		// console.log( 'filterSectList', filterSectList.value );
		return filterSectList.value.map( item => ( { value: item } ) );
	};
	
	
	return {
		formData,
		
		triggerOptionList,
		attributeList,
		
		fetchSectListSuggestions,
	};
};
const {
	formData,
	
	triggerOptionList,
	attributeList,
	
	fetchSectListSuggestions,
} = useFormOperator();

/**
 * 作用域: 初始化表单和校验表单
 * */
const useFormValidator = () => {
	// 获取表单dom
	const formRef = ref<FormInstance>();
	
	// 确定校验规则
	const rules = reactive( {
		triggerName: [
			{ required: true, message: '请勿更改触发位', trigger: 'blur' },
		],
		sect: [
			{ required: true, message: '请输入更改流派', trigger: 'change' },
		],
	} );
	
	/**
	 * 句柄: 校验表单
	 * */
	const handleSubmitForm = async () => {
		if ( !formRef.value ) return;
		await formRef.value.validate( ( valid, fields ) => {
			// 验证失败
			if ( !valid ) {
				console.log( 'error submit!', fields );
				return false;
			}
			
			/*
			* 验证成功流程
			* */
			// 将当前修改提交给存储
			const skillCardInfoStore = useSkillCardInfoStore();
			skillCardInfoStore.updateSkillCardInfo( formData.triggerName, <SectValue> formData.sect );
			
			// 关闭并重置对话框
			handleEmitCloseDialog();
		} );
	};
	
	/**
	 * 句柄: 触发 close-dialog 事件关闭对话框
	 * */
	const handleEmitCloseDialog = () => {
		// 清空所有输入
		formData.sect = '';
		formData.attribute = '';
		
		// 派发事件
		emits( 'closeDialog' );
	};
	
	return {
		formRef,
		
		rules,
		
		handleSubmitForm,
		handleEmitCloseDialog,
	};
};
const {
	formRef,
	
	rules,
	
	handleSubmitForm,
	handleEmitCloseDialog,
} = useFormValidator();

</script>
