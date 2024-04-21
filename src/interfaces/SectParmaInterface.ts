/**
 * SectParmaInterface.ts
 *
 * created by 2024/4/21
 * @file 传入 SelectableSkillCard.vue 组件的参数接口
 * @author  Yiero
 * */
import { SectValue } from './SectValue.ts';
import { Attribute } from './Attribute.ts';

/**
 * 传入参数
 * */
export interface SectParmaInterface {
	attribute: Attribute;
	mainSect: SectValue;
	secondSect: SectValue;
}
