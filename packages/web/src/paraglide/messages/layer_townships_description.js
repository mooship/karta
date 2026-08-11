/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Townships_DescriptionInputs */

const en_layer_townships_description = /** @type {(inputs: Layer_Townships_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modelled car drive-time from each recognised township area to its nearest selected job centre.`)
};

const st_layer_townships_description = /** @type {(inputs: Layer_Townships_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nako e akantsweng ya ho kganna koloi ho tloha sebakeng se seng le se seng sa lokishi se amohetsweng ho isa setsing sa mesebetsi se haufi se kgethilweng.`)
};

const zu_layer_townships_description = /** @type {(inputs: Layer_Townships_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isikhathi sokushayela imoto esilinganiselwe kusukela endaweni ngayinye yelokishi eqashelwe kuya esikhungweni somsebenzi esiseduze esikhethiwe.`)
};

/**
* | output |
* | --- |
* | "Modelled car drive-time from each recognised township area to its nearest selected job centre." |
*
* @param {Layer_Townships_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const layer_townships_description = /** @type {((inputs?: Layer_Townships_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Townships_DescriptionInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_townships_description(inputs)
	if (locale === "zu") return zu_layer_townships_description(inputs)
	return en_layer_townships_description(inputs)
});