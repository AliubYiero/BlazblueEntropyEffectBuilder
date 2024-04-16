<style lang="scss" scoped>
// 总展示容器
.show-container {
	display: flex;
	flex-flow: column;
	width: 100%;
	justify-content: center;
	align-items: center;
}

// 表单容器
.input-form {
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	gap: 20px;
}

// 选择框容器
.checkbox {
	// 容器
	&-container {
		display: flex;
		flex-flow: column;
	}
	
	@mixin flex {
		display: flex;
		gap: 20px;
	}
	
	&-first-line-container {
		@include flex;
	}
	
	&-second-line-container {
		@include flex;
	}
}

// 表单输入框提示文本样式
.text {
	margin-right: 5px;
}


// 数据展示
.data {
	// 数据列表展示容器
	&-list-container {
		width: 80%;
	}
	
	// 数据展示样式
	&-item__ {
		// 火颜色
		&fire {
			color: #ed5126;
		}
		
		// 冰颜色
		&ice {
			color: #128eb1;
		}
		
		// 电颜色
		&thunder {
			color: #f2d012;
		}
		
		// 毒颜色
		&poison {
			color: #b15212;
		}
		
		// 暗颜色
		&dark {
			color: #705242;
		}
		
		// 光颜色
		&light {
			color: #ffde59;
		}
		
		// 刃颜色
		&cut {
			color: #c2c2c2;
		}
		
	}
}

</style>

<template>
	<el-main class="show-container">
		<!-- 表单容器 -->
		<el-form class="input-form">
			<!-- 属性输入框(自动联想) -->
			<el-form-item class="attribute-form-item">
				<span class="text">属性: </span>
				<el-autocomplete
					v-model="attribute"
					:fetch-suggestions="handleFetchAttributeSuggestions"
					label="属性"
					placeholder="请输入/选择属性"
				/>
			</el-form-item>
			
			<!-- 流派输入框(自动联想) -->
			<el-form-item class="sect-form-item">
				<span class="text">流派: </span>
				<el-autocomplete
					v-model="sect"
					:fetch-suggestions="handleFetchSectSuggestions"
					label="流派"
					placeholder="请输入/选择流派"
				/>
			</el-form-item>
			
			<div class="checkbox-container">
				<!-- 流派选择 -->
				<section class="checkbox-first-line-container">
					<!-- 主流派筛选多选框 -->
					<el-form-item class="main-sect-form-item">
						<el-checkbox
							v-model="isCheckMainSect"
							label="主流派"
						/>
					</el-form-item>
					
					<!-- 副流派筛选多选框 -->
					<el-form-item class="second-sect-form-item">
						<el-checkbox
							v-model="isCheckSecondSect"
							label="副流派"
						/>
					</el-form-item>
				</section>
				
				<!-- 触发槽位选择 -->
				<section class="checkbox-second-line-container">
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
			</div>
		</el-form>
		
		<el-divider/>
		
		<!-- 数据列表 -->
		<el-table
			:data="filterSkillInfoList"
			class="data-list-container"
			stripe
		>
			<el-table-column label="名称" prop="name"/>
			<el-table-column label="主流派">
				<template #default="scope">
					<div
						:class="{[`data-item__${styleMapper[<Attribute>scope.row.mainAttribute]}`]: true}">
						{{
							scope.row.mainSect
						}}
					</div>
				</template>
			</el-table-column>
			<el-table-column label="副流派" prop="secondSect">
				<template #default="scope">
					<div
						:class="{[`data-item__${styleMapper[<Attribute>scope.row.secondAttribute]}`]: true}">
						{{
							scope.row.secondSect
						}}
					</div>
				</template>
			</el-table-column>
			<el-table-column label="触发槽位" prop="trigger"/>
			<el-table-column label="介绍" prop="description"
			                 width="300"/>
		</el-table>
	</el-main>
</template>

<script lang="ts" setup>
import { useSkillInfoStore } from '../store/useSkillInfoStore.ts';
import { Attribute } from '../interfaces/attribute.ts';
import { computed, Ref, ref } from 'vue';
import { Sect } from '../interfaces/sect.ts';
import { sectConfig } from '../config/sectConfig.ts';

const skillInfoStore = useSkillInfoStore();
console.log( skillInfoStore.skillInfoList );

/**
 * 句柄, 表单值作用域.
 *
 * 包括:
 * 属性, 操作属性的句柄,
 * 流派, 操作流派的句柄,
 * 主流派, 操作主流派的句柄,
 * 副流派, 操作副流派的句柄,
 * */
const useFormData = () => {
	const skillInfoList = skillInfoStore.skillInfoList;
	
	/**
	 * 创建用户输入的绑定值
	 * */
	const attribute = ref<Attribute | ''>( '' );
	
	/**
	 * 获取所有属性值建议
	 * */
	const handleFetchAttributeSuggestions = ( searchString: string, cb: Function ) => {
		/*
		* 过滤出 skillInfoList 所有属性
		* */
		const attributeSet: Set<Attribute> = new Set();
		skillInfoList.forEach( item => {
			attributeSet.add( item.mainAttribute );
		} );
		const attributeList = Array.from( attributeSet ).map( item => ( { value: item } ) );
		
		/*
		* 创建回调数组,
		* 如果 searchString 为空, 则返回所有属性值建议,
        * 否则返回属性值中包含 searchString 的属性值建议
		* */
		const attributeSuggestions = searchString
			? attributeList.filter( item => item.value.includes( searchString ) )
			: attributeList;
		
		
		cb( attributeSuggestions );
	};
	
	/*
	* 流派值
	* */
	/**
	 * 创建用户输入的绑定值
	 * */
	const sect = ref<Sect[keyof Sect] | ''>( '' );
	
	/**
	 * 获取所有派系建议
	 * */
	const handleFetchSectSuggestions = ( searchString: string, cb: Function ) => {
		searchString = searchString.trim();
		/*
		* 过滤出 skillInfoList 所有属性
		* */
		const sectSet: Set<Sect[keyof Sect]> = new Set();
		skillInfoList.forEach( item => {
			sectSet.add( item.mainSect );
		} );
		const sectList = Array.from( sectSet ).map( item => ( { value: item } ) );
		
		/*
		* 创建回调数组,
		* 如果 searchString 为空, 则返回所有属性值建议,
        * 否则返回属性值中包含 searchString 的属性值建议
		* */
		let sectSuggestions: { value: Sect[keyof Sect] }[] = sectList;
		// console.log( 'attribute: ', attribute.value.trim() );
		// 如果 attribute 有值, 那么选择 attribute 对应的派系
		if ( attribute.value.trim() ) {
			const sectList = sectConfig[ <Attribute> attribute.value.trim() ]
				.map( item => ( { value: item } ) ) as {
				value: Sect[keyof Sect]
			}[];
			
			sectSuggestions = sectList.filter( item => {
				return item.value.includes( searchString );
			} );
		}
		// 如果没有, 返回所有属性的排序
		else if ( searchString ) {
			sectSuggestions = sectList.filter( item => {
				return item.value.includes( searchString );
			} );
		}
		
		console.log( sectSuggestions );
		cb( sectSuggestions );
	};
	
	/**
	 * 创建用户选择的主流派勾选器,
	 * 默认勾选
	 *
	 * @default true
	 * */
	const isCheckMainSect = ref<boolean>( true );
	
	/**
	 * 创建用户选择的副流派勾选器,
	 * 默认勾选
	 *
	 * @default true
	 * */
	const isCheckSecondSect = ref<boolean>( true );
	
	/**
	 * 创建用户选择的触发位勾选器
	 * */
	const isCheckAttack = ref<boolean>( true );
	const isCheckSkill = ref<boolean>( true );
	const isCheckSprint = ref<boolean>( true );
	const isCheckCall = ref<boolean>( true );
	const isCheckInheriting = ref<boolean>( true );
	
	return {
		attribute,
		handleFetchAttributeSuggestions,
		sect,
		handleFetchSectSuggestions,
		isCheckMainSect,
		isCheckSecondSect,
		isCheckAttack,
		isCheckSkill,
		isCheckSprint,
		isCheckCall,
		isCheckInheriting,
	};
};

/**
 * 数据列表作用域
 * */
const useDataList = ( options: {
	attribute: Ref<'' | Attribute>,
	sect: Ref<'' | Sect[keyof Sect]>,
	
	isCheckMainSect: Ref<boolean>,
	isCheckSecondSect: Ref<boolean>,
	
	isCheckAttack: Ref<boolean>,
	isCheckSkill: Ref<boolean>,
	isCheckSprint: Ref<boolean>,
	isCheckCall: Ref<boolean>,
	isCheckInheriting: Ref<boolean>,
} ) => {
	let {
		attribute,
		sect,
		isCheckSecondSect,
		isCheckMainSect,
	} = options;
	
	/**
	 * 创建过滤列表, 通过传入的选择参数过滤技能数组
	 * */
	const filterSkillInfoList = computed( () => {
		const skillInfoList = skillInfoStore.skillInfoList;
		// console.log( 'skillInfoList:', skillInfoList );
		return skillInfoList.filter( skillInfo => {
			// 符合主属性
			const isMain = isCheckMainSect.value
				// 过滤属性
				&& skillInfo.mainAttribute.includes( attribute.value )
				// 过滤流派
				&& skillInfo.mainSect.includes( sect.value );
			
			// 符合副属性
			const isSecond = isCheckSecondSect.value
				// 过滤属性
				&& skillInfo.secondAttribute.includes( attribute.value )
				// 过滤流派
				&& skillInfo.secondSect.includes( sect.value );
			
			/*
			* 遍历 trigger, 判断当前 trigger 是否全部符合已勾选的 trigger
			* */
			// 生成当前取消勾选的所有触发位
			const checkTriggerList: Trigger[] = [
				isCheckAttack.value || '普攻',
				isCheckSkill.value || '技能',
				isCheckSprint.value || '冲刺',
				isCheckCall.value || '召唤',
				isCheckInheriting.value || '传承',
			].filter( item => item !== true ) as Trigger[];
			
			// 如果当前词条因为取消触发位不允许出现
			const isTrigger = skillInfo.trigger.every( trigger => {
				// console.log( 'trigger', trigger );
				return checkTriggerList.includes( trigger );
			} );
			
			// console.log( 'isTrigger', skillInfo.name, isTrigger );
			// console.log( 'isMain', isMain );
			// console.log( 'isSecond', isSecond );
			return ( isMain || isSecond ) && !isTrigger;
		} );
		
	} );
	
	/**
	 * 样式选择Mapper
	 * */
	const styleMapper = {
		'火': 'fire',
		'冰': 'ice',
		'电': 'thunder',
		'毒': 'poison',
		'光': 'light',
		'暗': 'dark',
		'刃': 'cut',
	};
	
	return {
		filterSkillInfoList,
		styleMapper,
	};
};

const {
	attribute,
	handleFetchAttributeSuggestions,
	sect,
	handleFetchSectSuggestions,
	isCheckMainSect,
	isCheckSecondSect,
	isCheckAttack,
	isCheckSkill,
	isCheckSprint,
	isCheckCall,
	isCheckInheriting,
} = useFormData();

const {
	filterSkillInfoList,
	styleMapper,
} = useDataList( {
	attribute,
	sect,
	isCheckSecondSect,
	isCheckMainSect,
	isCheckAttack,
	isCheckSkill,
	isCheckSprint,
	isCheckCall,
	isCheckInheriting,
} );

</script>
