/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Expand_HeightInputs */

const en_panel_expand_height = /** @type {(inputs: Panel_Expand_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expand panel height`)
};

const st_panel_expand_height = /** @type {(inputs: Panel_Expand_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Atolosa bophahamo ba panele`)
};

const zu_panel_expand_height = /** @type {(inputs: Panel_Expand_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Andisa ukuphakama kwephaneli`)
};

const xh_panel_expand_height = /** @type {(inputs: Panel_Expand_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Andisa ubude bephaneli`)
};

/**
* | output |
* | --- |
* | "Expand panel height" |
*
* @param {Panel_Expand_HeightInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const panel_expand_height = /** @type {((inputs?: Panel_Expand_HeightInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Expand_HeightInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_expand_height(inputs)
	if (locale === "zu") return zu_panel_expand_height(inputs)
	if (locale === "xh") return xh_panel_expand_height(inputs)
	return en_panel_expand_height(inputs)
});