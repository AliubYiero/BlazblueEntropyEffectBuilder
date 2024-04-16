/**
 * useSkillInfoStore.ts
 * created by 2024/4/11
 * @file 技能信息列表
 * @author  Yiero
 * */


import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { Attribute } from '../interfaces/attribute.ts';
import { Sect } from '../interfaces/sect.ts';
import { sectConfig } from '../config/sectConfig.ts';

/**
 * 创建一个流派Mapper
 * */
const createSectMapper = () => {
	const sectMapper: Map<Sect[keyof Sect], Attribute> = new Map();
	// 遍历属性和对应的值，将其映射到 Map 中
	Object.entries( sectConfig ).forEach( ( [ attribute, skills ] ) => {
		skills.forEach( ( skill ) => {
			sectMapper.set( <Sect[keyof Sect]> skill, <Attribute> attribute );
		} );
	} );
	return sectMapper;
};

/**
 * 技能信息储存
 * */
export const useSkillInfoStore = defineStore( 'skillInfo', () => {
	const sectMapper = createSectMapper();
	/**
	 * 创建一个技能信息
	 * */
	const createSkillInfo = (
		name: string,
		mainSect: Sect[keyof Sect],
		secondSect: Sect[keyof Sect],
		trigger: Trigger[],
		description: string = '',
	) => {
		const mainAttribute = sectMapper.get( mainSect );
		const secondAttribute = sectMapper.get( secondSect );
		
		/*
		* 错误处理, 如果获取为空则报错
		* */
		if ( !mainAttribute ) {
			throw new Error( 'Invalid main attribute' );
		}
		if ( !secondAttribute ) {
			throw new Error( 'Invalid second attribute' );
		}
		
		/*
		* 返回对象
		* */
		return {
			name,
			mainAttribute,
			mainSect,
			secondAttribute,
			secondSect,
			trigger,
			description,
		};
	};
	
	
	// 技能信息列表
	const skillInfoList = reactive( [
		/* 火系 */
		createSkillInfo( '火环燃烧', '燃烧', '火环', [ '传承' ], '火环可使敌人燃烧, 每秒收到400伤害. ' ),
		createSkillInfo( '火焰飞剑', '燃烧', '飞剑', [ '冲刺' ], '飞剑升级为火焰飞剑, 命中后可使敌人燃烧, 每秒收到170伤害. ' ),
		
		createSkillInfo( '爆燃飞弹', '火弹', '燃烧', [ '技能', '传承' ] ),
		createSkillInfo( '雷云火弹', '火弹', '雷云', [ '传承' ] ),
		
		createSkillInfo( '风暴火环', '火环', '刀刃风暴', [ '传承', '技能' ] ),
		
		createSkillInfo( '地雷火焰', '地雷', '燃烧', [ '召唤' ] ),
		createSkillInfo( '地雷闪光', '地雷', '闪光', [ '召唤' ] ),
		
		
		/* 冰系 */
		createSkillInfo( '冰锥极寒', '寒冷(爆发)', '冰锥', [ '冲刺', '传承' ] ),
		createSkillInfo( '冰霜脉冲', '寒冷(爆发)', '感电', [ '普攻', '技能' ] ),
		
		createSkillInfo( '寒冰毒雾', '寒冷(冰冻)', '中毒(毒雾)', [ '普攻' ] ),
		
		createSkillInfo( '光枪冰锥', '冰锥', '光枪', [ '传承', '技能' ] ),
		createSkillInfo( '冰冻冰锥', '冰锥', '寒冷(冰冻)', [ '普攻', '技能' ] ),
		
		createSkillInfo( '无尽冰刺', '冰刺', '寒冷(冰冻)', [ '召唤' ] ),
		createSkillInfo( '冰刺再生', '冰刺', '寒冷(爆发)', [ '召唤' ] ),
		createSkillInfo( '影子冰刺', '冰刺', '影子', [ '冲刺' ] ),
		
		
		/* 电系 */
		createSkillInfo( '闪电感电', '感电', '闪电链', [ '普攻', '传承', '技能' ] ),
		createSkillInfo( '黑洞脉冲', '感电', '黑洞', [ '传承' ] ),
		
		createSkillInfo( '电球闪电', '闪电链', '电球', [ '召唤' ] ),
		createSkillInfo( '触手闪电', '闪电链', '触手', [ '召唤' ] ),
		
		createSkillInfo( '光枪落雷', '落雷', '光枪', [ '传承', '技能' ] ),
		createSkillInfo( '电球落雷', '落雷', '电球', [ '召唤' ] ),
		createSkillInfo( '落雷惩戒', '落雷', '影刺', [ '普攻', '技能' ] ),
		createSkillInfo( '追踪落雷', '落雷', '感电', [ '冲刺' ] ),
		
		createSkillInfo( '电球发射', '电球', '闪电链', [ '召唤' ] ),
		
		
		/* 毒系 */
		createSkillInfo( '电解化毒', '中毒', '闪电链', [ '普攻', '传承', '技能' ] ),
		createSkillInfo( '剧毒史莱姆', '中毒', '史莱姆', [ '召唤' ] ),
		
		createSkillInfo( '分裂史莱姆', '史莱姆', '火精灵', [ '召唤' ] ),
		createSkillInfo( '结队史莱姆', '史莱姆', '毒液', [ '召唤' ] ),
		
		createSkillInfo( '中毒毒弹', '毒弹', '中毒', [ '普攻', '技能' ] ),
		createSkillInfo( '分裂毒弹', '毒弹', '火精灵', [ '冲刺' ] ),
		
		createSkillInfo( '毒液残留', '毒液', '毒弹', [ '冲刺' ] ),
		createSkillInfo( '地雷毒液', '毒液', '地雷', [ '召唤' ] ),
		
		
		/* 暗系 */
		createSkillInfo( '暴躁触手', '触手', '影刺', [ '召唤' ] ),
		createSkillInfo( '触手吞噬', '触手', '闪光', [ '召唤' ] ),
		
		createSkillInfo( '影刃冲刺', '影子', '刃环', [ '冲刺' ] ),
		createSkillInfo( '概率影爆', '影子', '黑洞', [ '冲刺' ] ),
		
		createSkillInfo( '影子穿刺', '影刺', '影子', [ '冲刺' ] ),
		createSkillInfo( '影子转化', '影刺', '地雷', [ '普攻', '技能' ] ),
		
		createSkillInfo( '触手坍塌', '黑洞', '触手', [ '召唤' ] ),
		createSkillInfo( '黑洞减速', '黑洞', '寒冷(冰冻)', [ '传承' ] ),
		
		
		/* 光系 */
		createSkillInfo( '落雷光枪', '光枪', '闪光', [ '冲刺' ] ),
		createSkillInfo( '闪光光枪', '光枪', '落雷', [ '传承' ] ),
		
		createSkillInfo( '火弹闪光', '闪光', '火弹', [ '技能', '传承' ] ),
		createSkillInfo( '标记闪光', '闪光', '圣光标记', [ '冲刺' ] ),
		createSkillInfo( '光枪闪光', '闪光', '光枪', [ '技能', '传承' ] ),
		
		createSkillInfo( '光波传递', '光波', '闪电链', [ '普攻' ] ),
		createSkillInfo( '光波快充', '光波', '光阵', [ '普攻' ] ),
		createSkillInfo( '光枪光波', '光波', '光枪', [ '技能', '传承' ] ),
		
		createSkillInfo( '光阵吸引', '光阵', '黑洞', [ '召唤' ] ),
		createSkillInfo( '持久光阵', '光阵', '闪光', [ '传承' ] ),
		
		createSkillInfo( '至圣标记', '圣光标记', '光波', [ '普攻' ] ),
		createSkillInfo( '冰刺标记', '圣光标记', '冰刺', [ '召唤' ] ),
		
		
		/* 刃系 */
		createSkillInfo( '嗜血飞剑', '飞剑', '撕裂', [ '冲刺' ] ),
		createSkillInfo( '双向飞剑', '飞剑', '火精灵', [ '冲刺' ] ),
		
		createSkillInfo( '针对影刺', '撕裂', '影刺', [ '普攻', '技能' ] ),
		
		createSkillInfo( '召唤回旋刃', '刃环', '飞剑', [ '召唤' ] ),
		createSkillInfo( '嗜血刃环', '刃环', '撕裂', [ '召唤' ] ),
		createSkillInfo( '连续刃环', '刃环', '中毒(毒环)', [ '技能' ] ),
		
		createSkillInfo( '嗜血风暴', '刀刃风暴', '撕裂', [ '传承', '技能' ] ),
		createSkillInfo( '黑洞刀刃风暴', '刀刃风暴', '黑洞', [ '传承' ] ),
	] );
	
	return {
		skillInfoList,
	};
} );
