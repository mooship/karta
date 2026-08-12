/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Commuter_Rail_LabelInputs */

const en_layer_commuter_rail_label = /** @type {(inputs: Layer_Commuter_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Commuter Rail`)
};

const st_layer_commuter_rail_label = /** @type {(inputs: Layer_Commuter_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terene ya Maeto`)
};

const zu_layer_commuter_rail_label = /** @type {(inputs: Layer_Commuter_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isitimela Sokuya Emsebenzini`)
};

const xh_layer_commuter_rail_label = /** @type {(inputs: Layer_Commuter_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Uloliwe Wokuya Emsebenzini`)
};

/**
* | output |
* | --- |
* | "Commuter Rail" |
*
* @param {Layer_Commuter_Rail_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const layer_commuter_rail_label = /** @type {((inputs?: Layer_Commuter_Rail_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Commuter_Rail_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_commuter_rail_label(inputs)
	if (locale === "zu") return zu_layer_commuter_rail_label(inputs)
	if (locale === "xh") return xh_layer_commuter_rail_label(inputs)
	return en_layer_commuter_rail_label(inputs)
});