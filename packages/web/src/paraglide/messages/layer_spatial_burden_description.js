/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Spatial_Burden_DescriptionInputs */

const en_layer_spatial_burden_description = /** @type {(inputs: Layer_Spatial_Burden_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A combined score weighting modelled car time and distance to transit together, to show where both burdens compound.`)
};

const af_layer_spatial_burden_description = /** @type {(inputs: Layer_Spatial_Burden_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`'n Gekombineerde telling wat gemodelleerde motortyd en afstand tot vervoer saam weeg, om te wys waar albei laste saamval.`)
};

/**
* | output |
* | --- |
* | "A combined score weighting modelled car time and distance to transit together, to show where both burdens compound." |
*
* @param {Layer_Spatial_Burden_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_spatial_burden_description = /** @type {((inputs?: Layer_Spatial_Burden_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Spatial_Burden_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_spatial_burden_description(inputs)
	return en_layer_spatial_burden_description(inputs)
});