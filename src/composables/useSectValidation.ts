/**
 * useSectValidation.ts
 * @file 流派表单验证 Composable
 * @description 提供 Element Plus 表单验证规则和验证方法
 * @author Yiero
 * */

import type { FormRules } from 'element-plus';
import { useSkillData } from './useSkillData.ts';
import { useSkillCardInfoStore } from '../store/useSkillCardInfoStore.ts';
import type { Trigger } from '../interfaces/Trigger.ts';
import type { SectValue } from '../interfaces/SectValue.ts';
import type { Attribute } from '../interfaces/Attribute.ts';

/**
 * 表单数据结构
 * */
interface FormData {
	sect: SectValue | '';
	attribute: Attribute | '';
}

/**
 * 流派表单验证 Composable
 * @param triggerName - 当前触发位名称
 * @returns 验证规则和验证方法
 * */
export const useSectValidation = ( triggerName: Trigger ) => {
	const skillData = useSkillData();
	const skillCardStore = useSkillCardInfoStore();

	/**
	 * Element Plus 表单验证规则
	 * */
	const rules: FormRules<FormData> = {
		sect: [
			{ required: true, message: '请选择流派', trigger: 'change' },
			{ validator: validateSectTriggerMatch, trigger: 'change' },
			{ validator: validateDuplicateSect, trigger: 'change' },
		],
	};

	/**
	 * 验证流派是否支持当前触发位
	 * */
	function validateSectTriggerMatch(
		_rule: unknown,
		value: SectValue | '',
		callback: ( error?: Error ) => void,
	) {
		if ( !value ) {
			callback();
			return;
		}

		const validTriggers = skillData.getValidTriggersForSect( value );
		if ( !validTriggers.includes( triggerName ) ) {
			callback( new Error( `该流派无法在【${ triggerName }】位使用` ) );
		} else {
			callback();
		}
	}

	/**
	 * 验证流派是否已在其他位置配置
	 * */
	function validateDuplicateSect(
		_rule: unknown,
		value: SectValue | '',
		callback: ( error?: Error ) => void,
	) {
		if ( !value ) {
			callback();
			return;
		}

		const existingCard = skillCardStore.skillCardInfoList.find(
			( card ) => card.sect === value && card.triggerName !== triggerName,
		);

		if ( existingCard ) {
			callback(
				new Error( `该流派已在【${ existingCard.triggerName }】位配置` ),
			);
		} else {
			callback();
		}
	}

	/**
	 * 验证流派与属性是否匹配
	 * @param sect - 流派名称
	 * @param attribute - 属性名称
	 * @returns 是否匹配
	 * */
	const validateAttributeMatch = (
		sect: SectValue | '',
		attribute: Attribute | '',
	): boolean => {
		if ( !sect || !attribute ) return true;
		const actualAttribute = skillData.getAttributeBySect( sect );
		return actualAttribute === attribute;
	};

	return {
		rules,
		validateAttributeMatch,
	};
};
