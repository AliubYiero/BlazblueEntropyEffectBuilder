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
import { SectValue } from '../interfaces/sectValue.ts';

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
	console.log( Array.from( sectMapper.keys() ).map( item => ( {
		name: item,
		trigger: [],
	} ) ) );
	
	/**
	 * 创建一个技能信息
	 * */
	const createSkillInfo = (
		name: string,
		mainSect: SectValue,
		secondSect: SectValue,
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
		
		createSkillInfo( '爆燃火弹', '火弹', '燃烧', [ '技能', '传承' ], '火弹对燃烧的敌人的伤害提示100%. ' ),
		createSkillInfo( '雷云火弹', '火弹', '闪电链(雷云)', [ '传承' ], '雷云会额外发射火弹, 每个造成220伤害' ),
		
		createSkillInfo( '风暴火环', '火环', '刀刃风暴', [ '传承', '技能' ], '刀刃风暴会产生火环, 造成1200伤害. ' ),
		
		createSkillInfo( '地雷火焰', '地雷', '燃烧', [ '召唤' ], '地雷爆炸后会残留火焰，对经过的敌人每秒造成300伤害. ' ),
		createSkillInfo( '地雷闪光', '地雷', '闪光', [ '召唤' ], '地雷爆炸时会产生闪光. ' ),
		
		createSkillInfo( '火精灵引爆', '火精灵', '燃烧', [ '普攻' ], '火精灵命中燃烧的敌人时有50%概率使其爆炸, 造成1150伤害. ' ),
		createSkillInfo( '火弹火精灵', '火精灵', '火弹', [ '技能', '传承' ], '火弹命中或击杀敌人将产生火精灵, 每个造成300伤害. ' ),
		createSkillInfo( '火精灵弹跳', '火精灵', '闪电链', [ '普攻' ], '火精灵可在敌人间弹跳，每次造成280伤害. ' ),
		
		/* 冰系 */
		createSkillInfo( '冰锥极寒', '寒冷(爆发)', '冰锥', [ '冲刺', '传承' ], '冰锥对敌人施加寒冷时, 寒冷层数加4. ' ),
		createSkillInfo( '冰霜脉冲', '寒冷(爆发)', '感电', [ '普攻', '技能' ], '寒气爆发升级为冰霜脉冲, 伤害提升36%, 麻痹敌人. ' ),
		
		createSkillInfo( '寒冰毒雾', '寒冷(冰冻)', '中毒(毒雾)', [ '普攻' ], '毒雾升级为寒冰毒雾，可冰冻敌人。' ),
		
		createSkillInfo( '光枪冰锥', '冰锥', '光枪', [ '传承', '技能' ], '光枪插地时周围会出现冰锥，造成600伤害。' ),
		createSkillInfo( '冰冻冰锥', '冰锥', '寒冷(冰冻)', [ '普攻', '技能' ], '敌人被冰冻时，会有冰锥向周围蔓延，可造成500伤害。' ),
		
		createSkillInfo( '无尽冰刺', '冰刺', '寒冷(冰冻)', [ '召唤' ], '冰刺会持续自动生成且索敌范围扩大，每个能造成90伤害. ' ),
		createSkillInfo( '冰刺再生', '冰刺', '寒冷(爆发)', [ '召唤' ], '冰刺命中非寒冷状态的敌人时，自动再生成3个冰刺。' ),
		createSkillInfo( '影子冰刺', '冰刺', '影子', [ '冲刺' ], '自身有冰刺时自身的影子也会有冰刺. ' ),
		
		
		/* 电系 */
		createSkillInfo( '闪电感电', '感电', '闪电链', [ '普攻', '传承', '技能' ], '闪电链连接到处于感电状态的敌人会立即引发脉冲。' ),
		createSkillInfo( '黑洞脉冲', '感电', '黑洞', [ '传承' ], '黑洞出现和消失时都将引发脉冲，可造成430伤害。' ),
		
		createSkillInfo( '电球闪电', '闪电链', '电球', [ '召唤' ], '电球命中敌人会产生闪电链连接周围敌人每次造成260伤害。' ),
		createSkillInfo( '触手闪电', '闪电链', '触手', [ '召唤' ], '暗影触手命中3次，可产生闪电链，每次连接造成340伤害. ' ),
		
		createSkillInfo( '光枪落雷', '落雷', '光枪', [ '传承', '技能' ], '光枪插地时会出现落雷，可造成1200伤害。' ),
		createSkillInfo( '电球落雷', '落雷', '电球', [ '召唤' ], '电球命中敌人时会出现落雷，可造成320伤害。' ),
		createSkillInfo( '落雷惩戒', '落雷', '影刺', [ '普攻', '技能' ], '被打出过影子的敌人，攻击时会招致落雷可造成900伤害。' ),
		createSkillInfo( '追踪落雷', '落雷', '感电', [ '冲刺' ], '落雷会追踪感电的敌人且伤害提升40%。' ),
		
		createSkillInfo( '电球发射', '电球', '闪电链', [ '召唤' ], '电球碰撞敌人会引发爆炸，造成400伤害; 绕身结束后电球会射出，每个造成1000伤害。' ),
		
		
		/* 毒系 */
		createSkillInfo( '电解化毒', '中毒', '闪电链', [ '普攻', '传承', '技能' ], '闪电链可使敌人中毒. ' ),
		createSkillInfo( '剧毒史莱姆', '中毒', '史莱姆', [ '召唤' ], '史莱姆可使敌人中毒。' ),
		
		createSkillInfo( '分裂史莱姆', '史莱姆', '火精灵', [ '召唤' ], '史莱姆可以分裂。' ),
		createSkillInfo( '结队史莱姆', '史莱姆', '毒液', [ '召唤' ], '可一次召唤2个史莱姆. ' ),
		
		createSkillInfo( '中毒毒弹', '毒弹', '中毒', [ '普攻', '技能' ], '处于中毒状态的敌人在毒发时会掉落毒弹, 可造成1720伤害. ' ),
		createSkillInfo( '分裂毒弹', '毒弹', '火精灵', [ '冲刺' ], '毒弹落地时会分裂出2个, 每个可造成430伤害. ' ),
		
		createSkillInfo( '毒液残留', '毒液', '毒弹', [ '冲刺' ], '毒弹爆炸后残留毒液, 每0.5秒造成160伤害. ' ),
		createSkillInfo( '地雷毒液', '毒液', '地雷', [ '召唤' ], '地雷爆炸时会出现毒液, 每0.5秒造成160伤害. ' ),
		
		
		/* 暗系 */
		createSkillInfo( '暴躁触手', '触手', '影刺', [ '召唤' ], '暗影触手持续时间减少8秒, 但结束时的一击伤害提升180%并可破霸体. ' ),
		createSkillInfo( '触手吞噬', '触手', '闪光', [ '召唤' ], '暗影触手会吞噬被致盲的普通敌人. ' ),
		
		createSkillInfo( '影刃冲刺', '影子', '刃环', [ '冲刺' ], '影子冲刺升级为影刃冲刺, 伤害提升110%. ' ),
		createSkillInfo( '概率影爆', '影子', '黑洞', [ '冲刺' ], '自身影子有50%的概率引发影爆, 造成700伤害. ' ),
		
		createSkillInfo( '影子穿刺', '影刺', '影子', [ '冲刺' ], '自身影子变成影刺, 造成340伤害. ' ),
		createSkillInfo( '影子转化', '影刺', '地雷', [ '普攻', '技能' ], '附近有敌人时, 影子会直接变成影刺, 并且伤害提升110%. ' ),
		
		createSkillInfo( '触手坍塌', '黑洞', '触手', [ '召唤' ], '召唤暗影触手时出现黑洞, 每秒造成300伤害. ' ),
		createSkillInfo( '黑洞减速', '黑洞', '寒冷(冰冻)', [ '传承' ], '黑洞范围内的所有敌人以及飞行物都会被减速. ' ),
		
		
		/* 光系 */
		createSkillInfo( '落雷光枪', '光枪', '闪光', [ '冲刺' ], '落雷命中敌人时, 会出现光枪射向被命中者, 可造成340伤害. ' ),
		createSkillInfo( '闪光光枪', '光枪', '落雷', [ '传承' ], '出现闪光时, 向其发射光枪, 可造成900伤害. ' ),
		
		createSkillInfo( '火弹闪光', '闪光', '火弹', [ '技能', '传承' ], '闪光会在火弹出现时跟着出现, 致盲敌人3秒. ' ),
		createSkillInfo( '标记闪光', '闪光', '圣光标记', [ '冲刺' ], '有圣光标记的敌人攻击或受击时有概率引发闪光. ' ),
		createSkillInfo( '光枪闪光', '闪光', '光枪', [ '技能', '传承' ], '光枪插地时会激发闪光, 致盲敌人3秒. ' ),
		
		createSkillInfo( '光波传递', '光波', '闪电链', [ '普攻' ], '光波命中敌人会向后传递, 每次伤害衰减20%. ' ),
		createSkillInfo( '光波快充', '光波', '光阵', [ '普攻' ], '在光阵范围内光波需要的充能时间减少2.5秒. ' ),
		createSkillInfo( '光枪光波', '光波', '光枪', [ '技能', '传承' ], '光枪命中敌人时会激发光波, 造成1200伤害. ' ),
		
		createSkillInfo( '光阵吸引', '光阵', '黑洞', [ '召唤' ], '光阵出现时会将附近的敌人朝中心吸引. ' ),
		createSkillInfo( '持久光阵', '光阵', '闪光', [ '传承' ], '光阵范围内的闪光可使光阵持续时间延长3秒. ' ),
		
		createSkillInfo( '至圣标记', '圣光标记', '光波', [ '普攻' ], '光波可触发圣光标记, 并使圣光标记额外造成70%伤害. ' ),
		createSkillInfo( '冰刺标记', '圣光标记', '冰刺', [ '召唤' ], '冰刺可触发圣光标记并产生爆炸, 造成190伤害. ' ),
		
		
		/* 刃系 */
		createSkillInfo( '嗜血飞剑', '飞剑', '撕裂', [ '冲刺' ], '飞剑命中被撕裂的敌人时额外造成300伤害. ' ),
		createSkillInfo( '双向飞剑', '飞剑', '火精灵', [ '冲刺' ], '飞剑将从两侧出现, 基础伤害增加340. ' ),
		
		createSkillInfo( '针对影刺', '撕裂', '影刺', [ '普攻', '技能' ], '撕裂敌人被影刺命中时会额外受到1000伤害, 并结束撕裂. ' ),
		
		createSkillInfo( '召唤回旋刃', '刃环', '飞剑', [ '召唤' ], '刃环升级为回旋刃, 自动飞向敌人并切割每次造成540伤害. ' ),
		createSkillInfo( '嗜血刃环', '刃环', '撕裂', [ '召唤' ], '刃环命中被撕裂的敌人时额外造成500伤害. ' ),
		createSkillInfo( '连续刃环', '刃环', '中毒(毒环)', [ '技能' ], '有毒环时, 靠近敌人刃环会持续出现, 每次造成80伤害. ' ),
		
		createSkillInfo( '嗜血风暴', '刀刃风暴', '撕裂', [ '传承', '技能' ], '刀刃风暴命中被撕裂的敌人时额外造成100伤害. ' ),
		createSkillInfo( '黑洞刀刃风暴', '刀刃风暴', '黑洞', [ '传承' ], '刀刃风暴会在黑洞周围出现, 每次切割造成60伤害. ' ),
	] );
	
	// 流派可使用触发位
	const triggerInfoList: {
		name: SectValue,
		trigger: Trigger[]
	}[] = reactive(
		[
			{
				'name': '燃烧',
				'trigger': [ '冲刺', '普攻', '技能' ],
			},
			{
				'name': '火弹',
				'trigger': [ '技能', '传承' ],
			},
			{
				'name': '火环',
				'trigger': [ '传承' ],
			},
			{
				'name': '地雷',
				'trigger': [ '召唤' ],
			},
			{
				'name': '火精灵',
				'trigger': [ '普攻' ],
			},
			{
				'name': '寒冷',
				'trigger': [ '普攻', '技能' ],
			},
			{
				'name': '寒冷(爆发)',
				'trigger': [ '普攻', '技能' ],
			},
			{
				'name': '寒冷(冰冻)',
				'trigger': [ '普攻', '技能' ],
			},
			{
				'name': '冰锥',
				'trigger': [ '冲刺', '传承' ],
			},
			{
				'name': '冰刺',
				'trigger': [ '召唤' ],
			},
			{
				'name': '感电',
				'trigger': [ '技能', '传承' ],
			},
			{
				'name': '闪电链',
				'trigger': [ '普攻', '技能', '传承' ],
			},
			{
				'name': '落雷',
				'trigger': [ '冲刺' ],
			},
			{
				'name': '电球',
				'trigger': [ '召唤' ],
			},
			{
				'name': '闪电链(雷云)',
				'trigger': [ '传承' ],
			},
			{
				'name': '中毒',
				'trigger': [ '普攻', '技能' ],
			},
			{
				'name': '中毒(毒雾)',
				'trigger': [ '普攻' ],
			},
			{
				'name': '中毒(毒环)',
				'trigger': [ '技能' ],
			},
			{
				'name': '毒弹',
				'trigger': [ '冲刺' ],
			},
			{
				'name': '毒液',
				'trigger': [ '技能', '传承' ],
			},
			{
				'name': '史莱姆',
				'trigger': [ '召唤' ],
			},
			{
				'name': '触手',
				'trigger': [ '召唤' ],
			},
			{
				'name': '影子',
				'trigger': [ '冲刺' ],
			},
			{
				'name': '影刺',
				'trigger': [ '普攻', '技能' ],
			},
			{
				'name': '黑洞',
				'trigger': [ '传承' ],
			},
			{
				'name': '光枪',
				'trigger': [ '技能', '传承' ],
			},
			{
				'name': '闪光',
				'trigger': [ '传承' ],
			},
			{
				'name': '光波',
				'trigger': [ '普攻' ],
			},
			{
				'name': '光阵',
				'trigger': [ '召唤' ],
			},
			{
				'name': '圣光标记',
				'trigger': [ '冲刺' ],
			},
			{
				'name': '飞剑',
				'trigger': [ '冲刺' ],
			},
			{
				'name': '撕裂',
				'trigger': [ '普攻', '技能' ],
			},
			{
				'name': '刃环',
				'trigger': [ '召唤' ],
			},
			{
				'name': '刀刃风暴',
				'trigger': [ '技能', '传承' ],
			},
		],
	);
	
	return {
		skillInfoList,
		triggerInfoList,
	};
} );
