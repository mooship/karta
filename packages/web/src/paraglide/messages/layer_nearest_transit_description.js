/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Nearest_Transit_DescriptionInputs */

const en_layer_nearest_transit_description = /** @type {(inputs: Layer_Nearest_Transit_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Straight-line distance from each recognised township area to the nearest formal transit route.`)
};

const af_layer_nearest_transit_description = /** @type {(inputs: Layer_Nearest_Transit_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reguitlynafstand vanaf elke erkende lokasiegebied na die naaste formele vervoerroete.`)
};

/**
* | output |
* | --- |
* | "Straight-line distance from each recognised township area to the nearest formal transit route." |
*
* @param {Layer_Nearest_Transit_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_nearest_transit_description = /** @type {((inputs?: Layer_Nearest_Transit_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Nearest_Transit_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_nearest_transit_description(inputs)
	return en_layer_nearest_transit_description(inputs)
});