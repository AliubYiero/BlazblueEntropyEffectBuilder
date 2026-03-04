<style lang="scss" scoped>
.form-container {
	padding: 8px 0;
}

.form-group {
	margin-bottom: 16px;
}

.form-label {
	font-family: var(--font-chinese);
	font-size: 12px;
	font-weight: 500;
	color: hsl(var(--muted-foreground));
	margin-bottom: 8px;
	display: block;
}

.trigger-display {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 12px;
	background: hsl(var(--secondary));
	border-radius: calc(var(--radius) - 2px);
}

.trigger-badge {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 500;
	color: hsl(var(--secondary-foreground));
}

.input-row {
	display: flex;
	gap: 8px;
}

.input-main {
	flex: 1;
}

.input-side {
	width: 100px;
}

.sect-options {
	margin-top: 12px;
	max-height: 180px;
	overflow-y: auto;
}

.sect-option {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px;
	border: 1px solid hsl(var(--border));
	border-radius: calc(var(--radius) - 2px);
	margin-bottom: 4px;
	cursor: pointer;
	
	&:hover {
		background: hsl(var(--accent) / 0.3);
	}
	
	&.is-selected {
		border-color: hsl(var(--ring));
	}
}

.sect-name {
	font-family: var(--font-chinese);
	font-size: 12px;
	color: hsl(var(--foreground));
}

.button-group {
	display: flex;
	gap: 8px;
	justify-content: flex-end;
	margin-top: 24px;
	padding-top: 16px;
	border-top: 1px solid hsl(var(--border));
}
</style>

<template>
	<div class="form-container">
		<el-form ref="formRef" :model="formData" :rules="rules">
			<div class="form-group">
				<label class="form-label">触发位</label>
				<div class="trigger-display">
					<span class="trigger-badge">{{ triggerName }}</span>
				</div>
			</div>
			
			<div class="form-group">
				<label class="form-label">流派</label>
				<div class="input-row">
					<el-form-item class="input-main" prop="sect">
						<el-autocomplete
							v-model="formData.sect"
							:fetch-suggestions="fetchSectListSuggestions"
							clearable
							placeholder="选择流派"
						/>
					</el-form-item>
					<el-select v-model="formData.attribute" class="input-side"
					           clearable placeholder="属性">
						<el-option v-for="attr in attributeList" :key="attr"
						           :value="attr"/>
					</el-select>
				</div>
			</div>
			
			<div v-if="filterSectList.length > 0" class="sect-options">
				<div
					v-for="sect in filterSectList.slice(0, 6)"
					:key="sect.name"
					:class="['sect-option', { 'is-selected': formData.sect === sect.name }]"
					@click="formData.sect = sect.name"
				>
					<span
						:class="['element-dot', `element-dot--${styleMapper[sect.attribute]}`]"></span>
					<span class="sect-name">{{ sect.name }}</span>
				</div>
			</div>
			
			<div class="button-group">
				<el-button @click="handleCancel">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../domains/config/types.ts';
import { sectConfig, attributeList } from '../../domains/config/index.ts';
import { getTriggerInfoList, getAttributeBySectValue } from '../../domains/skill/repository.ts';
import { useBuilderStore, type SkillCardInfo } from '../../domains/builder/index.ts';
import { validateSect, validateAttributeMatch } from '../../shared/validation/index.ts';
import type { FormInstance, FormRules } from 'element-plus';

const props = defineProps<{ triggerName: Trigger }>();
const emit = defineEmits<{ ( event: 'closeDialog' ): void }>();

const builderStore = useBuilderStore();

const formData = reactive( {
	triggerName: props.triggerName,
	attribute: '' as Attribute | '',
	sect: '' as SectValue | '',
} );

const formRef = ref<FormInstance>();

/**
 * 表单验证规则
 * */
const rules: FormRules = {
	sect: [
		{ required: true, message: '请选择流派', trigger: 'change' },
		{
			validator: ( _rule, value, callback ) => {
				const result = validateSect(
					value,
					props.triggerName,
					[ ...builderStore.skillCardInfoList ] as SkillCardInfo[],
				);
				if ( !result.valid ) {
					callback( new Error( result.message ) );
				} else {
					callback();
				}
			},
			trigger: 'change',
		},
	],
};

/**
 * 监听流派变化，自动设置属性
 * */
watch(
	() => formData.sect,
	( val ) => {
		if ( val ) {
			const actualAttr = getAttributeBySectValue( val );
			if ( actualAttr && actualAttr !== formData.attribute ) {
				formData.attribute = actualAttr;
			}
		}
	},
);

/**
 * 监听属性变化，验证与流派是否匹配
 * */
watch(
	() => formData.attribute,
	( val ) => {
		if ( val && formData.sect ) {
			const isMatch = validateAttributeMatch( formData.sect, val );
			if ( !isMatch ) {
				formData.sect = '';
			}
		}
	},
);

/**
 * 根据当前触发位和选中属性筛选可用流派
 * */
const filterSectList = computed( () => {
	const triggerInfoList = getTriggerInfoList();
	const available = triggerInfoList.value.filter( ( t ) =>
		t.trigger.includes( props.triggerName ),
	);
	const all: { name: SectValue; attribute: Attribute }[] = [];

	for ( const attr of attributeList ) {
		sectConfig[ attr ].forEach( ( sect ) => {
			if ( available.find( ( t ) => t.name === sect ) ) {
				all.push( { name: sect as SectValue, attribute: attr } );
			}
		} );
	}

	return formData.attribute ? all.filter( ( s ) => s.attribute === formData.attribute ) : all;
} );

/**
 * 流派搜索建议
 * */
const fetchSectListSuggestions = ( search: string, cb: Function ) => {
	const list = filterSectList.value.map( ( s ) => ( { value: s.name } ) );
	cb( search ? list.filter( ( s ) => s.value.includes( search ) ) : list );
};

/**
 * 提交表单
 * */
const handleSubmit = async () => {
	if ( !formRef.value ) return;
	await formRef.value.validate( ( valid ) => {
		if ( valid && formData.sect ) {
			console.log( props.triggerName, formData.sect );
			builderStore.updateSkillCardInfo( props.triggerName, formData.sect );
			handleCancel();
		}
	} );
};

/**
 * 取消并关闭对话框
 * */
const handleCancel = () => {
	formData.sect = '';
	formData.attribute = '';
	emit( 'closeDialog' );
};

const styleMapper: Record<Attribute, string> = {
	火: 'fire',
	冰: 'ice',
	电: 'thunder',
	毒: 'poison',
	暗: 'dark',
	光: 'light',
	刃: 'blade',
};
</script>
