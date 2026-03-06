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
	color: var(--muted-foreground);
	margin-bottom: 8px;
	display: block;
}

.label-hint {
	font-weight: 400;
	color: hsl(from var(--muted-foreground) h s l / 0.7);
	margin-left: 4px;
}

.trigger-display {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 8px 12px;
	background: var(--secondary);
	border-radius: calc(var(--radius) - 2px);
}

.trigger-badge {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 500;
	color: var(--secondary-foreground);
}

.input-full {
	width: 100%;
}

.skill-options {
	max-height: 280px;
	overflow-y: auto;
	border: 1px solid var(--border);
	border-radius: calc(var(--radius) - 2px);
	padding: 8px;
}

.skill-option {
	padding: 10px;
	border-bottom: 1px solid hsl(from var(--border) h s l / 0.5);
	cursor: pointer;
	border-radius: calc(var(--radius) - 2px);
	transition: background 0.15s ease;
	
	&:hover {
		background: hsl(from var(--accent) h s l / 0.7);
	}
	
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
	color: var(--foreground);
}

.skill-sects {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.skill-desc {
	font-family: var(--font-chinese);
	font-size: 11px;
	color: var(--muted-foreground);
	line-height: 1.4;
}

.no-data {
	padding: 24px;
	text-align: center;
	border: 1px dashed var(--border);
	border-radius: calc(var(--radius) - 2px);
}

.no-data-text {
	font-family: var(--font-chinese);
	font-size: 12px;
	color: var(--muted-foreground);
}

/* Element Plus 样式覆盖 */
:deep(.el-tag) {
	--el-tag-bg-color: var(--secondary);
	--el-tag-border-color: var(--border);
	--el-tag-text-color: var(--secondary-foreground);
}
</style>

<template>
	<div class="form-container">
		<div class="form-group">
			<label class="form-label">触发位</label>
			<div class="trigger-display">
				<span class="trigger-badge">{{ triggerName }}</span>
			</div>
		</div>
		
		<div class="form-group">
			<label class="form-label">属性筛选</label>
			<el-select v-model="selectedAttribute" class="input-full"
			           clearable placeholder="全部属性">
				<el-option v-for="attr in attributeList" :key="attr"
				           :value="attr"/>
			</el-select>
		</div>
		
		<div class="form-group">
			<label class="form-label">
				关联双重策略
				<span class="label-hint">(点击卡片激活继承)</span>
			</label>
			<div v-if="filteredSkillList.length > 0" class="skill-options">
				<div
					v-for="skill in filteredSkillList"
					:key="skill.name"
					class="skill-option"
					@click="handleSelect(skill)"
				>
					<div class="skill-info">
						<div class="skill-name">{{ skill.name }}</div>
						<div class="skill-sects">
							<el-tag size="small">
								<span
									:class="['element-dot', `element-dot--${styleMapper[skill.mainAttribute]}`]"></span>
								{{ skill.mainSect }}
							</el-tag>
							<el-tag size="small">
								<span
									:class="['element-dot', `element-dot--${styleMapper[skill.secondAttribute]}`]"></span>
								{{ skill.secondSect }}
							</el-tag>
						</div>
						<div class="skill-desc">{{ skill.description }}</div>
					</div>
				</div>
			</div>
			<div v-else class="no-data">
				<span class="no-data-text">暂无匹配的双重策略</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { Trigger } from '../../interfaces/Trigger.ts';
import type { Attribute } from '../../interfaces/Attribute.ts';
import { attributeList } from '../../domains/config/index.ts';
import { filterByTrigger } from '../../domains/skill/repository.ts';
import { useBuilderStore } from '../../domains/builder/index.ts';
import type { SkillInfo } from '../../core/data/types.ts';

const props = defineProps<{
	triggerName: Trigger;
}>();

const emit = defineEmits<{
	( event: 'closeDialog' ): void;
}>();

const builderStore = useBuilderStore();

const selectedAttribute = ref<Attribute | ''>( '' );

const filteredSkillList = computed<SkillInfo[]>( () => {
	const skillsByTrigger = filterByTrigger( props.triggerName );
	let result = skillsByTrigger.value;
	
	if ( selectedAttribute.value ) {
		result = result.filter( ( skill ) =>
			skill.mainAttribute === selectedAttribute.value ||
			skill.secondAttribute === selectedAttribute.value,
		);
	}
	
	return result;
} );

const handleSelect = ( skill: SkillInfo ) => {
	builderStore.setInheritSkill( props.triggerName, skill );
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
