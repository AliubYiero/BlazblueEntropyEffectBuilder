<style lang="scss" scoped>
/* ============================================
   修改流派对话框组件 - 赛博朋克风格
   ============================================ */

.form-container {
	padding: 8px 0;
}

/* 表单组 */
.form-group {
	margin-bottom: 24px;
	
	&:last-child {
		margin-bottom: 0;
	}
}

.form-label {
	display: flex;
	align-items: center;
	gap: 8px;
	font-family: var(--font-display);
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: var(--text-secondary);
	margin-bottom: 12px;
	
	.label-dot {
		width: 6px;
		height: 6px;
		background: var(--accent-primary);
		border-radius: 2px;
	}
}

/* 触发位显示 */
.trigger-display {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px 16px;
	background: rgba(0, 212, 255, 0.05);
	border: 1px solid rgba(0, 212, 255, 0.2);
	border-radius: 8px;
}

.trigger-badge {
	font-family: var(--font-display);
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: var(--accent-primary);
}

.trigger-icon {
	width: 24px;
	height: 24px;
	background: var(--accent-primary);
	clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
	opacity: 0.6;
}

/* 输入行 */
.input-row {
	display: flex;
	gap: 12px;
	align-items: stretch;
}

.input-main {
	flex: 1;
}

.input-side {
	width: 120px;
	flex-shrink: 0;
}

/* 自定义输入框样式 */
:deep(.el-input__wrapper),
:deep(.el-autocomplete .el-input__wrapper) {
	background: rgba(0, 0, 0, 0.3) !important;
	border: 1px solid var(--border-primary) !important;
	border-radius: 8px !important;
	padding: 4px 12px !important;
	min-height: 42px;
	transition: all var(--transition-normal) !important;
	
	&:hover {
		border-color: var(--border-glow) !important;
	}
	
	&.is-focus,
	&:focus-within {
		border-color: var(--accent-primary) !important;
		box-shadow: 0 0 20px rgba(0, 212, 255, 0.15) !important;
	}
}

:deep(.el-input__inner) {
	font-family: var(--font-chinese) !important;
	font-size: 14px !important;
	color: var(--text-primary) !important;
	
	&::placeholder {
		color: var(--text-muted) !important;
	}
}

/* 选择框样式 */
:deep(.el-select) {
	width: 100%;
	
	.el-input__wrapper {
		background: rgba(0, 0, 0, 0.3) !important;
	}
}

/* 按钮组 */
.button-group {
	display: flex;
	gap: 12px;
	justify-content: flex-end;
	margin-top: 32px;
	padding-top: 24px;
	border-top: 1px solid var(--border-primary);
}

.btn {
	font-family: var(--font-display) !important;
	font-size: 12px !important;
	font-weight: 600 !important;
	letter-spacing: 2px !important;
	text-transform: uppercase !important;
	padding: 12px 28px !important;
	border-radius: 8px !important;
	transition: all var(--transition-normal) !important;
	cursor: pointer;
	
	&--primary {
		background: linear-gradient(135deg, var(--accent-primary) 0%, #00a8cc 100%) !important;
		border: none !important;
		color: var(--bg-primary) !important;
		
		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4) !important;
		}
		
		&:active {
			transform: translateY(0);
		}
	}
	
	&--secondary {
		background: transparent !important;
		border: 1px solid var(--border-primary) !important;
		color: var(--text-secondary) !important;
		
		&:hover {
			border-color: var(--text-secondary) !important;
			color: var(--text-primary) !important;
		}
	}
}

/* 可选流派列表 */
.sect-options {
	margin-top: 16px;
	max-height: 200px;
	overflow-y: auto;
}

.sect-option {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 14px;
	background: rgba(0, 0, 0, 0.2);
	border: 1px solid var(--border-primary);
	border-radius: 8px;
	margin-bottom: 8px;
	cursor: pointer;
	transition: all var(--transition-fast);
	
	&:hover {
		border-color: var(--border-glow);
		background: rgba(0, 212, 255, 0.03);
	}
	
	&.is-selected {
		border-color: var(--accent-primary);
		background: rgba(0, 212, 255, 0.08);
	}
}

.sect-color {
	width: 8px;
	height: 8px;
	border-radius: 2px;
	
	&--fire { background: var(--element-fire); }
	&--ice { background: var(--element-ice); }
	&--thunder { background: var(--element-thunder); }
	&--poison { background: var(--element-poison); }
	&--dark { background: var(--element-dark); }
	&--light { background: var(--element-light); }
	&--blade { background: var(--element-blade); }
}

.sect-name {
	font-family: var(--font-chinese);
	font-size: 13px;
	color: var(--text-primary);
}

.sect-attribute {
	font-family: var(--font-display);
	font-size: 9px;
	font-weight: 600;
	letter-spacing: 1px;
	text-transform: uppercase;
	color: var(--text-muted);
	margin-left: auto;
}

/* 响应式 */
@media (max-width: 480px) {
	.input-row {
		flex-direction: column;
	}
	
	.input-side {
		width: 100%;
	}
	
	.button-group {
		flex-direction: column-reverse;
		
		.btn {
			width: 100%;
		}
	}
}
</style>

<template>
	<div class="form-container">
		<el-form ref="formRef" :model="formData" :rules="rules">
			<!-- 触发位显示 -->
			<div class="form-group">
				<label class="form-label">
					<span class="label-dot"></span>
					触发位
				</label>
				<div class="trigger-display">
					<div class="trigger-icon"></div>
					<span class="trigger-badge">{{ triggerName }}</span>
				</div>
			</div>
			
			<!-- 流派选择 -->
			<div class="form-group">
				<label class="form-label">
					<span class="label-dot"></span>
					流派
				</label>
				<div class="input-row">
					<el-form-item prop="sect" class="input-main">
						<el-autocomplete
							v-model="formData.sect"
							:fetch-suggestions="fetchSectListSuggestions"
							placeholder="输入或选择流派"
							clearable
							@select="handleSectSelect"
						/>
					</el-form-item>
					<el-select
						v-model="formData.attribute"
						class="input-side"
						placeholder="属性筛选"
						clearable
					>
						<el-option
							v-for="attr in attributeList"
							:key="attr"
							:value="attr"
						/>
					</el-select>
				</div>
			</div>
			
			<!-- 快捷选择 -->
			<div v-if="filterSectList.length > 0" class="sect-options">
				<div 
					v-for="sect in filterSectList.slice(0, 8)"
					:key="sect.name"
					:class="['sect-option', { 'is-selected': formData.sect === sect.name }]"
					@click="handleQuickSelect(sect.name)"
				>
					<div :class="['sect-color', `sect-color--${styleMapper[sect.attribute]}`]"></div>
					<span class="sect-name">{{ sect.name }}</span>
					<span class="sect-attribute">{{ sect.attribute }}</span>
				</div>
			</div>
			
			<!-- 按钮组 -->
			<div class="button-group">
				<button type="button" class="btn btn--secondary" @click="handleCancel">
					取消
				</button>
				<button type="button" class="btn btn--primary" @click="handleSubmit">
					确定
				</button>
			</div>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, watch } from 'vue';
import { Trigger } from '../../interfaces/Trigger.ts';
import { Attribute } from '../../interfaces/Attribute.ts';
import { SectValue } from '../../interfaces/SectValue.ts';
import { sectConfig } from '../../config/sectConfig.ts';
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { useSkillCardInfoStore } from '../../store/useSkillCardInfoStore.ts';
import { FormInstance } from 'element-plus';

const props = defineProps<{
	triggerName: Trigger;
}>();

const emit = defineEmits<{
	(event: 'closeDialog'): void;
}>();

const skillInfoStore = useSkillInfoStore();
const skillCardInfoStore = useSkillCardInfoStore();

/* 表单数据 */
const formData = reactive({
	triggerName: props.triggerName,
	attribute: '' as Attribute | '',
	sect: '' as SectValue | '',
});

const formRef = ref<FormInstance>();

/* 校验规则 */
const rules = {
	sect: [{ required: true, message: '请选择流派', trigger: 'change' }],
};

/* 属性列表 */
const attributeList = Object.keys(sectConfig) as Attribute[];

/* 根据流派获取属性 */
const getAttributeBySect = (sect: SectValue): Attribute | '' => {
	for (const attr of Object.keys(sectConfig) as Attribute[]) {
		if (sectConfig[attr].includes(sect)) {
			return attr;
		}
	}
	return '';
};

/* 监听流派变化 */
watch(() => formData.sect, (newVal) => {
	if (newVal) {
		formData.attribute = getAttributeBySect(newVal);
	}
});

/* 过滤流派列表 */
const filterSectList = computed(() => {
	const allSects: { name: SectValue; attribute: Attribute }[] = [];
	
	// 获取该触发位可用的流派
	const availableTriggers = skillInfoStore.triggerInfoList.filter(
		t => t.trigger.includes(props.triggerName)
	);
	
	for (const attr of Object.keys(sectConfig) as Attribute[]) {
		sectConfig[attr].forEach(sect => {
			const triggerInfo = availableTriggers.find(t => t.name === sect);
			if (triggerInfo) {
				allSects.push({ name: sect as SectValue, attribute: attr });
			}
		});
	}
	
	// 按属性筛选
	if (formData.attribute) {
		return allSects.filter(s => s.attribute === formData.attribute);
	}
	
	return allSects;
});

/* 获取流派建议 */
const fetchSectListSuggestions = (searchString: string, cb: Function) => {
	let suggestions = filterSectList.value.map(s => ({ value: s.name }));
	
	if (searchString) {
		suggestions = suggestions.filter(s => 
			s.value.toLowerCase().includes(searchString.toLowerCase())
		);
	}
	
	cb(suggestions);
};

/* 选择流派 */
const handleSectSelect = (item: { value: SectValue }) => {
	formData.sect = item.value;
};

/* 快捷选择 */
const handleQuickSelect = (sect: SectValue) => {
	formData.sect = sect;
};

/* 提交 */
const handleSubmit = async () => {
	if (!formRef.value) return;
	
	await formRef.value.validate((valid) => {
		if (valid && formData.sect) {
			skillCardInfoStore.updateSkillCardInfo(props.triggerName, formData.sect);
			handleCancel();
		}
	});
};

/* 取消 */
const handleCancel = () => {
	formData.sect = '';
	formData.attribute = '';
	emit('closeDialog');
};

/* 样式映射 */
const styleMapper: Record<Attribute, string> = {
	'火': 'fire',
	'冰': 'ice',
	'电': 'thunder',
	'毒': 'poison',
	'暗': 'dark',
	'光': 'light',
	'刃': 'blade',
};
</script>