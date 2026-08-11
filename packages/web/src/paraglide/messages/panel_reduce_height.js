/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Reduce_HeightInputs */

const en_panel_reduce_height = /** @type {(inputs: Panel_Reduce_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reduce panel height`)
};

const st_panel_reduce_height = /** @type {(inputs: Panel_Reduce_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fokotsa bophahamo ba panele`)
};

const zu_panel_reduce_height = /** @type {(inputs: Panel_Reduce_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nciphisa ukuphakama kwephaneli`)
};

/**
* | output |
* | --- |
* | "Reduce panel height" |
*
* @param {Panel_Reduce_HeightInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const panel_reduce_height = /** @type {((inputs?: Panel_Reduce_HeightInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Reduce_HeightInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_reduce_height(inputs)
	if (locale === "zu") return zu_panel_reduce_height(inputs)
	return en_panel_reduce_height(inputs)
});