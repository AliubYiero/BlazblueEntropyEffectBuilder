<style lang="scss" scoped>
/* ============================================
   双重词条筛选页 - 赛博朋克风格
   ============================================ */

.page-container {
	min-height: calc(100vh - 72px);
	padding: 32px;
	max-width: 1600px;
	margin: 0 auto;
}

/* 筛选区域 */
.filter-section {
	margin-bottom: 40px;
}

.filter-card {
	background: var(--bg-card);
	border: 1px solid var(--border-primary);
	border-radius: 16px;
	padding: 32px;
	position: relative;
	overflow: hidden;
	
	/* 顶部装饰线 */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 32px;
		right: 32px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
	}
}

.filter-title {
	font-family: var(--font-display);
	font-size: 12px;
	font-weight: 600;
	letter-spacing: 3px;
	text-transform: uppercase;
	color: var(--accent-primary);
	margin-bottom: 24px;
	display: flex;
	align-items: center;
	gap: 12px;
	
	&::before {
		content: '';
		width: 16px;
		height: 2px;
		background: var(--accent-primary);
	}
}

/* 输入行 */
.input-row {
	display: flex;
	gap: 24px;
	margin-bottom: 24px;
	flex-wrap: wrap;
}

.input-group {
	flex: 1;
	min-width: 200px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.input-label {
	font-family: var(--font-chinese);
	font-size: 13px;
	font-weight: 500;
	color: var(--text-secondary);
	display: flex;
	align-items: center;
	gap: 8px;
	
	.label-icon {
		width: 6px;
		height: 6px;
		background: var(--accent-primary);
		border-radius: 2px;
	}
}

/* 复选框区域 */
.checkbox-section {
	padding-top: 16px;
	border-top: 1px solid var(--border-primary);
}

.checkbox-row {
	display: flex;
	gap: 16px;
	flex-wrap: wrap;
	
	&:not(:last-child) {
		margin-bottom: 12px;
	}
}

.checkbox-group {
	display: flex;
	gap: 12px;
	align-items: center;
}

.checkbox-label {
	font-family: var(--font-display);
	font-size: 10px;
	font-weight: 600;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: var(--text-muted);
	min-width: 60px;
}

/* 元素复选框 */
.element-checkbox {
	padding: 8px 16px;
	border-radius: 8px;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid var(--border-primary);
	transition: all var(--transition-normal);
	cursor: pointer;
	
	&:hover {
		border-color: var(--border-glow);
		background: rgba(0, 212, 255, 0.05);
	}
	
	&.is-checked {
		border-color: var(--accent-primary);
		background: rgba(0, 212, 255, 0.1);
		
		.checkbox-text {
			color: var(--accent-primary);
		}
	}
	
	.checkbox-text {
		font-family: var(--font-chinese);
		font-size: 13px;
		color: var(--text-secondary);
		transition: color var(--transition-fast);
	}
}

/* 结果统计 */
.results-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
}

.results-count {
	font-family: var(--font-display);
	font-size: 14px;
	color: var(--text-secondary);
	
	.count-number {
		font-size: 24px;
		font-weight: 700;
		color: var(--accent-primary);
		margin-right: 8px;
		text-shadow: 0 0 20px var(--element-ice-glow);
	}
}

/* 技能卡片网格 */
.skills-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
	gap: 20px;
}

/* 技能卡片 */
.skill-card {
	background: var(--bg-card);
	border: 1px solid var(--border-primary);
	border-radius: 12px;
	padding: 20px;
	transition: all var(--transition-normal);
	position: relative;
	overflow: hidden;
	cursor: pointer;
	
	/* 顶部元素色条 */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--card-accent, var(--accent-primary));
		opacity: 0.8;
	}
	
	/* Hover 光效 */
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, 
			rgba(0, 212, 255, 0.03) 0%, 
			transparent 50%);
		opacity: 0;
		transition: opacity var(--transition-normal);
	}
	
	&:hover {
		border-color: var(--card-accent, var(--border-glow));
		transform: translateY(-4px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
		
		&::after {
			opacity: 1;
		}
		
		.skill-name {
			text-shadow: 0 0 20px var(--card-accent-glow, var(--element-ice-glow));
		}
	}
	
	/* 元素主题 */
	&--fire {
		--card-accent: var(--element-fire);
		--card-accent-glow: var(--element-fire-glow);
	}
	
	&--ice {
		--card-accent: var(--element-ice);
		--card-accent-glow: var(--element-ice-glow);
	}
	
	&--thunder {
		--card-accent: var(--element-thunder);
		--card-accent-glow: var(--element-thunder-glow);
	}
	
	&--poison {
		--card-accent: var(--element-poison);
		--card-accent-glow: var(--element-poison-glow);
	}
	
	&--dark {
		--card-accent: var(--element-dark);
		--card-accent-glow: var(--element-dark-glow);
	}
	
	&--light {
		--card-accent: var(--element-light);
		--card-accent-glow: var(--element-light-glow);
	}
	
	&--blade {
		--card-accent: var(--element-blade);
		--card-accent-glow: var(--element-blade-glow);
	}
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 16px;
}

.skill-name {
	font-family: var(--font-chinese);
	font-size: 18px;
	font-weight: 700;
	color: var(--text-primary);
	transition: text-shadow var(--transition-normal);
}

.trigger-badges {
	display: flex;
	gap: 6px;
}

.trigger-badge {
	font-family: var(--font-display);
	font-size: 10px;
	font-weight: 600;
	letter-spacing: 1px;
	padding: 4px 8px;
	border-radius: 4px;
	background: rgba(0, 212, 255, 0.1);
	color: var(--accent-primary);
	border: 1px solid rgba(0, 212, 255, 0.2);
}

/* 流派组合 */
.sect-combo {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 12px;
}

.sect-item {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.sect-label {
	font-family: var(--font-display);
	font-size: 9px;
	font-weight: 600;
	letter-spacing: 2px;
	text-transform: uppercase;
	color: var(--text-muted);
}

.sect-name {
	font-family: var(--font-chinese);
	font-size: 14px;
	font-weight: 600;
}

.sect-connector {
	font-size: 20px;
	color: var(--text-muted);
	opacity: 0.5;
}

/* 描述 */
.skill-description {
	font-family: var(--font-chinese);
	font-size: 13px;
	line-height: 1.7;
	color: var(--text-secondary);
	padding-top: 12px;
	border-top: 1px solid var(--border-primary);
}

/* 空状态 */
.empty-state {
	grid-column: 1 / -1;
	text-align: center;
	padding: 80px 20px;
}

.empty-icon {
	font-size: 64px;
	margin-bottom: 24px;
	opacity: 0.3;
}

.empty-text {
	font-family: var(--font-chinese);
	font-size: 16px;
	color: var(--text-muted);
}

/* 响应式 */
@media (max-width: 768px) {
	.page-container {
		padding: 16px;
	}
	
	.filter-card {
		padding: 20px;
	}
	
	.input-row {
		flex-direction: column;
		gap: 16px;
	}
	
	.skills-grid {
		grid-template-columns: 1fr;
	}
}
</style>

<template>
	<div class="page-container">
		<!-- 筛选区域 -->
		<section class="filter-section">
			<div class="filter-card">
				<div class="filter-title">筛选条件</div>
				
				<!-- 输入框 -->
				<div class="input-row">
					<div class="input-group">
						<label class="input-label">
							<span class="label-icon"></span>
							属性
						</label>
						<el-autocomplete
							v-model="attribute"
							:fetch-suggestions="handleFetchAttributeSuggestions"
							placeholder="选择或输入属性"
							clearable
						/>
					</div>
					
					<div class="input-group">
						<label class="input-label">
							<span class="label-icon"></span>
							流派
						</label>
						<el-autocomplete
							v-model="sect"
							:fetch-suggestions="handleFetchSectSuggestions"
							placeholder="选择或输入流派"
							clearable
						/>
					</div>
				</div>
				
				<!-- 复选框 -->
				<div class="checkbox-section">
					<div class="checkbox-row">
						<span class="checkbox-label">流派</span>
						<div class="checkbox-group">
							<label 
								v-for="item in sectCheckboxes" 
								:key="item.key"
								:class="['element-checkbox', { 'is-checked': item.value }]"
							>
								<el-checkbox v-model="item.value" :label="item.label" />
							</label>
						</div>
					</div>
					
					<div class="checkbox-row">
						<span class="checkbox-label">槽位</span>
						<div class="checkbox-group">
							<label 
								v-for="item in triggerCheckboxes" 
								:key="item.key"
								:class="['element-checkbox', { 'is-checked': item.value }]"
							>
								<el-checkbox v-model="item.value" :label="item.label" />
							</label>
						</div>
					</div>
				</div>
			</div>
		</section>
		
		<!-- 结果统计 -->
		<div class="results-header">
			<div class="results-count">
				<span class="count-number">{{ filterSkillInfoList.length }}</span>
				条双重策略
			</div>
		</div>
		
		<!-- 技能卡片网格 -->
		<div class="skills-grid">
			<div 
				v-if="filterSkillInfoList.length === 0"
				class="empty-state"
			>
				<div class="empty-icon">◇</div>
				<div class="empty-text">没有找到匹配的双重策略</div>
			</div>
			
			<div 
				v-for="skill in filterSkillInfoList"
				:key="skill.name"
				:class="['skill-card', `skill-card--${styleMapper[skill.mainAttribute]}`]"
			>
				<div class="card-header">
					<h3 class="skill-name">{{ skill.name }}</h3>
					<div class="trigger-badges">
						<span 
							v-for="trigger in skill.trigger" 
							:key="trigger"
							class="trigger-badge"
						>{{ trigger }}</span>
					</div>
				</div>
				
				<div class="sect-combo">
					<div class="sect-item">
						<span class="sect-label">主流派</span>
						<span 
							class="sect-name"
							:style="{ color: `var(--element-${styleMapper[skill.mainAttribute]})` }"
						>{{ skill.mainSect }}</span>
					</div>
					
					<span class="sect-connector">⊕</span>
					
					<div class="sect-item">
						<span class="sect-label">副流派</span>
						<span 
							class="sect-name"
							:style="{ color: `var(--element-${styleMapper[skill.secondAttribute]})` }"
						>{{ skill.secondSect }}</span>
					</div>
				</div>
				
				<p class="skill-description">{{ skill.description }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useSkillInfoStore } from '../../store/useSkillInfoStore.ts';
import { Attribute } from '../../interfaces/Attribute.ts';
import { computed, ref, reactive } from 'vue';
import { Sect } from '../../interfaces/Sect.ts';
import { sectConfig } from '../../config/sectConfig.ts';
import { Trigger } from '../../interfaces/Trigger.ts';

const skillInfoStore = useSkillInfoStore();

/* 表单数据 */
const attribute = ref<Attribute | ''>('');
const sect = ref<Sect[keyof Sect] | ''>('');

/* 复选框数据 */
const sectCheckboxes = reactive([
	{ key: 'main', label: '主流派', value: true },
	{ key: 'second', label: '副流派', value: true },
]);

const triggerCheckboxes = reactive([
	{ key: 'attack', label: '普攻', value: true },
	{ key: 'skill', label: '技能', value: true },
	{ key: 'sprint', label: '冲刺', value: true },
	{ key: 'call', label: '召唤', value: true },
	{ key: 'inherit', label: '传承', value: true },
]);

/* 属性建议 */
const handleFetchAttributeSuggestions = (searchString: string, cb: Function) => {
	const attributeSet: Set<Attribute> = new Set();
	skillInfoStore.skillInfoList.forEach(item => {
		attributeSet.add(item.mainAttribute);
	});
	const attributeList = Array.from(attributeSet).map(item => ({ value: item }));
	
	const suggestions = searchString
		? attributeList.filter(item => item.value.includes(searchString))
		: attributeList;
	
	cb(suggestions);
};

/* 流派建议 */
const handleFetchSectSuggestions = (searchString: string, cb: Function) => {
	const sectSet: Set<Sect[keyof Sect]> = new Set();
	skillInfoStore.skillInfoList.forEach(item => {
		sectSet.add(item.mainSect);
	});
	const sectList = Array.from(sectSet).map(item => ({ value: item }));
	
	let suggestions = sectList;
	
	if (attribute.value.trim()) {
		const filteredList = sectConfig[<Attribute>attribute.value.trim()]
			.map(item => ({ value: item }));
		suggestions = searchString 
			? filteredList.filter(item => item.value.includes(searchString))
			: filteredList;
	} else if (searchString) {
		suggestions = sectList.filter(item => item.value.includes(searchString));
	}
	
	cb(suggestions);
};

/* 过滤列表 */
const filterSkillInfoList = computed(() => {
	return skillInfoStore.skillInfoList.filter(skillInfo => {
		// 主流派筛选
		const isMain = sectCheckboxes[0].value
			&& skillInfo.mainAttribute.includes(attribute.value)
			&& skillInfo.mainSect.includes(sect.value);
		
		// 副流派筛选
		const isSecond = sectCheckboxes[1].value
			&& skillInfo.secondAttribute.includes(attribute.value)
			&& skillInfo.secondSect.includes(sect.value);
		
		// 触发位筛选
		const uncheckedTriggers: Trigger[] = [
			triggerCheckboxes[0].value || '普攻',
			triggerCheckboxes[1].value || '技能',
			triggerCheckboxes[2].value || '冲刺',
			triggerCheckboxes[3].value || '召唤',
			triggerCheckboxes[4].value || '传承',
		].filter(item => item !== true) as Trigger[];
		
		const isTrigger = skillInfo.trigger.every(trigger => 
			uncheckedTriggers.includes(trigger)
		);
		
		return (isMain || isSecond) && !isTrigger;
	});
});

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