import { DoubleSkillName } from './DoubleSkillName.ts';
import { SectValue } from './SectValue.ts';
import { Attribute } from './Attribute.ts';
import { Trigger } from './Trigger.ts';

/**
 * 双重技能信息接口
 * */
export interface SkillInfoInterface {
	name: DoubleSkillName,
	mainSect: SectValue,
	mainAttribute: Attribute,
	secondSect: SectValue,
	secondAttribute: Attribute,
	trigger: Trigger[],
	description: string,
}
