/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Rapid_Rail_LabelInputs */

const en_layer_rapid_rail_label = /** @type {(inputs: Layer_Rapid_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rapid Rail`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_rapid_rail_label = /** @type {((inputs?: Layer_Rapid_Rail_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Rapid_Rail_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_rapid_rail_label(inputs)
	return en_layer_rapid_rail_label(inputs)
});