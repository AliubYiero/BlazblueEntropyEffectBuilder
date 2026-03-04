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

.label-hint {
	font-weight: 400;
	color: hsl(var(--muted-foreground) / 0.7);
	margin-left: 4px;
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

.input-full {
	width: 100%;
}

.skill-options {
	max-height: 280px;
	overflow-y: auto;
	border: 1px solid hsl(var(--border));
	border-radius: calc(var(--radius) - 2px);
	padding: 8px;
}

.skill-option {
	padding: 10px;
	border-bottom: 1px solid hsl(var(--border) / 0.5);
	
	&:last-child {
		border-bottom: none;
	}
}

.skill-info {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.skill-name {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 600;
	color: hsl(var(--foreground));
}

.skill-sects {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.sect-tag {
	cursor: pointer;
	transition: all 0.15s ease;
	display: flex;
	align-items: center;
	gap: 4px;
	
	&:hover {
		transform: translateY(-1px);
	}
	
	&.is-selected {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		border-color: hsl(var(--primary));
	}
	
	&.is-disabled {
		opacity: 0.4;
		cursor: not-allowed;
		background: hsl(var(--secondary) / 0.5);
		border-color: hsl(var(--border) / 0.5);
		
		&:hover {
			transform: none;
		}
	}
}

.skill-desc {
	font-family: var(--font-chinese);
	font-size: 11px;
	color: hsl(var(--muted-foreground));
	line-height: 1.4;
}

.no-data {
	padding: 24px;
	text-align: center;
	border: 1px dashed hsl(var(--border));
	border-radius: calc(var(--radius) - 2px);
}

.no-data-text {
	font-family: var(--font-chinese);
	font-size: 12px;
	color: hsl(var(--muted-foreground));
}

.selected-info {
	padding: 10px 12px;
	background: hsl(var(--accent) / 0.3);
	border-radius: calc(var(--radius) - 2px);
	margin-bottom: 16px;
}

.selected-label {
	font-family: var(--font-chinese);
	font-size: 12px;
	color: hsl(var(--muted-foreground));
}

.selected-value {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 600;
	color: hsl(var(--foreground));
}

.button-group {
	display: flex;
	gap: 8px;
	justify-content: flex-end;
	padding-top: 16px;
	border-top: 1px solid hsl(var(--border));
}

/* Element Plus 样式覆盖 */
:deep(.el-tag) {
	--el-tag-bg-color: hsl(var(--secondary));
	--el-tag-border-color: hsl(var(--border));
	--el-tag-text-color: hsl(var(--secondary-foreground));
}

:deep(.el-tag.is-selected) {
	--el-tag-bg-color: hsl(var(--primary));
	--el-tag-border-color: hsl(var(--primary));
	--el-tag-text-color: hsl(var(--primary-foreground));
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
				<label class="form-label">属性筛选</label>
				<el-select v-model="formData.attribute" class="input-full"
				           clearable placeholder="全部属性">
					<el-option v-for="attr in attributeList" :key="attr"
					           :value="attr"/>
				</el-select>
			</div>
			
			<div class="form-group">
				<label class="form-label">
					关联双重策略
					<span class="label-hint">(点击选择流派)</span>
				</label>
				<div v-if="filteredSkillList.length > 0" class="skill-options">
					<div
						v-for="skill in filteredSkillList"
						:key="skill.name"
						class="skill-option"
					>
						<div class="skill-info">
							<div class="skill-name">{{ skill.name }}</div>
							<div class="skill-sects">
								<el-tooltip
									:content="`该流派不支持${props.triggerName}位`"
									:disabled="!isSectAvailableForTrigger(skill.mainSect)"
									placement="top"
								>
									<el-tag
										:class="['sect-tag', 'sect-tag--main', {
											'is-selected': formData.sect === skill.mainSect,
											'is-disabled': !isSectAvailableForTrigger(skill.mainSect)
										}]"
										:disabled="!isSectAvailableForTrigger(skill.mainSect)"
										size="small"
										@click="selectSect(skill.mainSect, skill)"
									>
										<span
											:class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
										{{ skill.mainSect }}
									</el-tag>
								</el-tooltip>
								<el-tooltip
									:content="`该流派不支持${props.triggerName}位`"
									:disabled="!isSectAvailableForTrigger(skill.secondSect)"
									placement="top"
								>
									<el-tag
										:class="['sect-tag', 'sect-tag--second', {
											'is-selected': formData.sect === skill.secondSect,
											'is-disabled': !isSectAvailableForTrigger(skill.secondSect)
										}]"
										:disabled="!isSectAvailableForTrigger(skill.secondSect)"
										size="small"
										@click="selectSect(skill.secondSect, skill)"
									>
										<span
											:class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"></span>
										{{ skill.secondSect }}
									</el-tag>
								</el-tooltip>
							</div>
							<div class="skill-desc">{{
									skill.description
								}}
							</div>
						</div>
					</div>
				</div>
				<div v-else class="no-data">
					<span class="no-data-text">暂无匹配的双重策略</span>
				</div>
			</div>
			
			<div v-if="formData.sect" class="selected-info">
				<span class="selected-label">已选择：</span>
				<span class="selected-value">{{ formData.sect }}</span>
			</div>
			
			<div class="button-group">
				<el-button @click="handleCancel">取消</el-button>
				<el-button :disabled="!formData.sect" type="primary"
				           @click="handleSubmit">确定
				</el-button>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import type { SectValue } from '../../domains/config/types.ts';
import { attributeList } from '../../domains/config/index.ts';
import { filterByTrigger } from '../../domains/skill/repository.ts';
import { getSectInfo } from '../../domains/config/utils.ts';
import {
	type SkillCardInfo,
	useBuilderStore,
} from '../../domains/builder/index.ts';
import { validateSect } from '../../shared/validation/index.ts';
import type { FormInstance, FormRules } from 'element-plus';
import type { SkillInfo } from '../../core/data/types.ts';

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
				}
				else {
					callback();
				}
			},
			trigger: 'change',
		},
	],
};

/**
 * 筛选占用当前触发位的双重策略
 * 如果选择了属性，则进一步筛选包含该属性的策略
 * */
const filteredSkillList = computed( (): SkillInfo[] => {
	// 获取占用当前触发位的所有双重策略
	const skillsByTrigger = filterByTrigger( props.triggerName );
	let result = skillsByTrigger.value;
	
	// 如果选择了属性，筛选包含该属性的策略
	if ( formData.attribute ) {
		result = result.filter( ( skill ) =>
			skill.mainAttribute === formData.attribute ||
			skill.secondAttribute === formData.attribute,
		);
	}
	
	return result;
} );

/**
 * 选择流派
 * */
/**
 * 判断流派是否支持当前触发位
 * @param sect - 流派名称
 * @returns 是否可用
 */
const isSectAvailableForTrigger = ( sect: SectValue ): boolean => {
	if ( !sect ) return false;
	const sectInfo = getSectInfo( sect );
	if ( !sectInfo ) return false;
	// 检查该流派的任意技能是否支持当前触发位
	return sectInfo.skill.some( s => s.trigger === props.triggerName );
};

/**
 * 选择流派
 * @param sect - 流派名称
 * @param skill - 所属双重策略信息（用于检查可用性）
 * */
const selectSect = ( sect: SectValue, _skill: SkillInfo ) => {
	// 检查流派是否支持当前触发位
	if ( !isSectAvailableForTrigger( sect ) ) {
		return;
	}
	formData.sect = sect;
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
