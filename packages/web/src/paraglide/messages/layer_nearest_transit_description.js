/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Nearest_Transit_DescriptionInputs */

const en_layer_nearest_transit_description = /** @type {(inputs: Layer_Nearest_Transit_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Straight-line distance from each recognised township area to the nearest formal transit route.`)
};

const st_layer_nearest_transit_description = /** @type {(inputs: Layer_Nearest_Transit_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bohole bo otlolohileng ho tloha sebakeng se seng le se seng sa lokishi se amohetsweng ho isa tseleng ya semmuso ya dipalangwa e haufi.`)
};

const zu_layer_nearest_transit_description = /** @type {(inputs: Layer_Nearest_Transit_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibanga eliqondile kusukela endaweni ngayinye yelokishi eqashelwe kuya emzileni osemthethweni wezokuthutha oseduze.`)
};

/**
* | output |
* | --- |
* | "Straight-line distance from each recognised township area to the nearest formal transit route." |
*
* @param {Layer_Nearest_Transit_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const layer_nearest_transit_description = /** @type {((inputs?: Layer_Nearest_Transit_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Nearest_Transit_DescriptionInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_nearest_transit_description(inputs)
	if (locale === "zu") return zu_layer_nearest_transit_description(inputs)
	return en_layer_nearest_transit_description(inputs)
});