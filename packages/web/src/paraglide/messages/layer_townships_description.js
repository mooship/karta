/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Townships_DescriptionInputs */

const en_layer_townships_description = /** @type {(inputs: Layer_Townships_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modelled car drive-time from each recognised township area to its nearest selected job centre.`)
};

const af_layer_townships_description = /** @type {(inputs: Layer_Townships_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gemodelleerde motorrytyd vanaf elke erkende lokasiegebied na die naaste geselekteerde werksentrum.`)
};

/**
* | output |
* | --- |
* | "Modelled car drive-time from each recognised township area to its nearest selected job centre." |
*
* @param {Layer_Townships_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_townships_description = /** @type {((inputs?: Layer_Townships_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Townships_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_townships_description(inputs)
	return en_layer_townships_description(inputs)
});