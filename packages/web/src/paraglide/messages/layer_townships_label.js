/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Townships_LabelInputs */

const en_layer_townships_label = /** @type {(inputs: Layer_Townships_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modelled car time`)
};

const af_layer_townships_label = /** @type {(inputs: Layer_Townships_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gemodelleerde motortyd`)
};

/**
* | output |
* | --- |
* | "Modelled car time" |
*
* @param {Layer_Townships_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_townships_label = /** @type {((inputs?: Layer_Townships_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Townships_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_townships_label(inputs)
	return en_layer_townships_label(inputs)
});