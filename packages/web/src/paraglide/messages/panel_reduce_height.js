/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Reduce_HeightInputs */

const en_panel_reduce_height = /** @type {(inputs: Panel_Reduce_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reduce panel height`)
};

const af_panel_reduce_height = /** @type {(inputs: Panel_Reduce_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verklein paneelhoogte`)
};

/**
* | output |
* | --- |
* | "Reduce panel height" |
*
* @param {Panel_Reduce_HeightInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_reduce_height = /** @type {((inputs?: Panel_Reduce_HeightInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Reduce_HeightInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_panel_reduce_height(inputs)
	return en_panel_reduce_height(inputs)
});