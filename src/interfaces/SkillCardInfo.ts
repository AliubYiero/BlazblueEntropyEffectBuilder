/**
 * SkillCard.ts
 * created by 2024/4/20
 * @file 技能卡片信息接口
 * @author  Yiero
 * */
import { SectValue } from './SectValue.ts';
import { Trigger } from './Trigger.ts';
import { EmptyStringAble } from './Nullable.ts';

export interface SkillCardInfo {
	// 流派名称
	sect: EmptyStringAble<SectValue>;
	// 触发位的名称, 如普攻, 技能...
	triggerName: Trigger;
}
