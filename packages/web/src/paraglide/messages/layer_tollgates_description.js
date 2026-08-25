/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Tollgates_DescriptionInputs */

const en_layer_tollgates_description = /** @type {(inputs: Layer_Tollgates_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approximate locations of physical toll plazas on Gauteng's tolled highways — a direct cost of car-based commuting alongside modelled drive time.`)
};

const af_layer_tollgates_description = /** @type {(inputs: Layer_Tollgates_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Benaderde liggings van fisiese tolhekke op Gauteng se getolde snelweë — 'n direkte koste van motorgebaseerde pendel, saam met gemodelleerde rytyd.`)
};

/**
* | output |
* | --- |
* | "Approximate locations of physical toll plazas on Gauteng's tolled highways — a direct cost of car-based commuting alongside modelled drive time." |
*
* @param {Layer_Tollgates_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_tollgates_description = /** @type {((inputs?: Layer_Tollgates_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Tollgates_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_tollgates_description(inputs)
	return en_layer_tollgates_description(inputs)
});