/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Tollgate_Popup_OperatorInputs */

const en_tollgate_popup_operator = /** @type {(inputs: Tollgate_Popup_OperatorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Operator`)
};

const af_tollgate_popup_operator = /** @type {(inputs: Tollgate_Popup_OperatorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Operateur`)
};

/**
* | output |
* | --- |
* | "Operator" |
*
* @param {Tollgate_Popup_OperatorInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const tollgate_popup_operator = /** @type {((inputs?: Tollgate_Popup_OperatorInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tollgate_Popup_OperatorInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_tollgate_popup_operator(inputs)
	return en_tollgate_popup_operator(inputs)
});