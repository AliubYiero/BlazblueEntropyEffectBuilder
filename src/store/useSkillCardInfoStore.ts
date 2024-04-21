/**
 * useSkillCardInfoStore.ts
 * created by 2024/4/20
 * @file 技能构建页, 技能卡片信息卡片列表
 * @author  Yiero
 * */
import { defineStore } from 'pinia';
import {
	SkillCardInfoTuple,
} from '../interfaces/SkillCardInfoTuple.ts';
import { reactive } from 'vue';
import { Trigger } from '../interfaces/Trigger.ts';
import { SectValue } from '../interfaces/SectValue.ts';

export const useSkillCardInfoStore = defineStore( 'skillCardInfo', () => {
	/** 技能卡片信息列表 */
	const skillCardInfoList: SkillCardInfoTuple = reactive( [
		{ triggerName: '普攻', sect: '', inherit: false },
		{ triggerName: '技能', sect: '', inherit: false },
		{ triggerName: '冲刺', sect: '', inherit: false },
		{ triggerName: '传承', sect: '', inherit: false },
		{ triggerName: '召唤', sect: '', inherit: false },
	] );
	
	/**
	 * 更新卡片继承状态信息
	 * */
	const updateSkillCardInfoInherit = ( triggerName: Trigger, inherit: boolean ) => {
		const currentSkillCardInfo = skillCardInfoList.find( item => item.triggerName === triggerName );
		if ( !currentSkillCardInfo ) {
			return;
		}
		currentSkillCardInfo.inherit = inherit;
	};
	
	/**
	 * 更新卡片的信息
	 * */
	const updateSkillCardInfo = ( triggerName: Trigger, name: SectValue ) => {
		const currentSkillCardInfo = skillCardInfoList.find( item => item.triggerName === triggerName );
		if ( !currentSkillCardInfo ) {
			return;
		}
		currentSkillCardInfo.sect = name;
	};
	
	return {
		skillCardInfoList,
		
		updateSkillCardInfoInherit,
		updateSkillCardInfo,
	};
} );
