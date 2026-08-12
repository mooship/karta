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

const xh_layer_nearest_transit_description = /** @type {(inputs: Layer_Nearest_Transit_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umgama oqondileyo ukusuka kwindawo ngayinye yelokishi eliqashelweyo ukuya kumzila osemthethweni wezokuthutha okufuphi.`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_nearest_transit_description = /** @type {((inputs?: Layer_Nearest_Transit_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Nearest_Transit_DescriptionInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_nearest_transit_description(inputs)
	if (locale === "zu") return zu_layer_nearest_transit_description(inputs)
	if (locale === "xh") return xh_layer_nearest_transit_description(inputs)
	if (locale === "af") return af_layer_nearest_transit_description(inputs)
	return en_layer_nearest_transit_description(inputs)
});