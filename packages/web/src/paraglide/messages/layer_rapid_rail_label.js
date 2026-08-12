/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Rapid_Rail_LabelInputs */

const en_layer_rapid_rail_label = /** @type {(inputs: Layer_Rapid_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rapid Rail`)
};

const st_layer_rapid_rail_label = /** @type {(inputs: Layer_Rapid_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terene e Potlakileng`)
};

const zu_layer_rapid_rail_label = /** @type {(inputs: Layer_Rapid_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isitimela Esisheshayo`)
};

const xh_layer_rapid_rail_label = /** @type {(inputs: Layer_Rapid_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Uloliwe Okhawulezayo`)
};

const af_layer_rapid_rail_label = /** @type {(inputs: Layer_Rapid_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Snelspoor`)
};

/**
* | output |
* | --- |
* | "Rapid Rail" |
*
* @param {Layer_Rapid_Rail_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_rapid_rail_label = /** @type {((inputs?: Layer_Rapid_Rail_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Rapid_Rail_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_rapid_rail_label(inputs)
	if (locale === "zu") return zu_layer_rapid_rail_label(inputs)
	if (locale === "xh") return xh_layer_rapid_rail_label(inputs)
	if (locale === "af") return af_layer_rapid_rail_label(inputs)
	return en_layer_rapid_rail_label(inputs)
});