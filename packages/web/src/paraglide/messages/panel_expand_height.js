/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Expand_HeightInputs */

const en_panel_expand_height = /** @type {(inputs: Panel_Expand_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expand panel height`)
};

const af_panel_expand_height = /** @type {(inputs: Panel_Expand_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vergroot paneelhoogte`)
};

/**
* | output |
* | --- |
* | "Expand panel height" |
*
* @param {Panel_Expand_HeightInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_expand_height = /** @type {((inputs?: Panel_Expand_HeightInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Expand_HeightInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_panel_expand_height(inputs)
	return en_panel_expand_height(inputs)
});