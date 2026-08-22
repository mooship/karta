/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Nearest_Transit_LabelInputs */

const en_layer_nearest_transit_label = /** @type {(inputs: Layer_Nearest_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Distance to nearest transit`)
};

const af_layer_nearest_transit_label = /** @type {(inputs: Layer_Nearest_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afstand tot naaste vervoer`)
};

/**
* | output |
* | --- |
* | "Distance to nearest transit" |
*
* @param {Layer_Nearest_Transit_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_nearest_transit_label = /** @type {((inputs?: Layer_Nearest_Transit_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Nearest_Transit_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_nearest_transit_label(inputs)
	return en_layer_nearest_transit_label(inputs)
});