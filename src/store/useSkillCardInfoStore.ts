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
		{ triggerName: '普攻', sect: '' },
		{ triggerName: '技能', sect: '' },
		{ triggerName: '冲刺', sect: '' },
		{ triggerName: '传承', sect: '' },
		{ triggerName: '召唤', sect: '' },
	] );
	
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
		
		updateSkillCardInfo,
	};
} );
