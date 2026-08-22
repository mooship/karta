/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Commuter_Rail_LabelInputs */

const en_layer_commuter_rail_label = /** @type {(inputs: Layer_Commuter_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Commuter Rail`)
};

const af_layer_commuter_rail_label = /** @type {(inputs: Layer_Commuter_Rail_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pendelspoor`)
};

/**
* | output |
* | --- |
* | "Commuter Rail" |
*
* @param {Layer_Commuter_Rail_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_commuter_rail_label = /** @type {((inputs?: Layer_Commuter_Rail_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Commuter_Rail_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_commuter_rail_label(inputs)
	return en_layer_commuter_rail_label(inputs)
});