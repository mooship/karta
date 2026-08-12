/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Townships_LabelInputs */

const en_layer_townships_label = /** @type {(inputs: Layer_Townships_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modelled car time`)
};

const st_layer_townships_label = /** @type {(inputs: Layer_Townships_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nako ya koloi e akantsweng`)
};

const zu_layer_townships_label = /** @type {(inputs: Layer_Townships_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isikhathi semoto esilinganiselwe`)
};

const xh_layer_townships_label = /** @type {(inputs: Layer_Townships_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ixesha lemoto elilinganiselweyo`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_townships_label = /** @type {((inputs?: Layer_Townships_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Townships_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_townships_label(inputs)
	if (locale === "zu") return zu_layer_townships_label(inputs)
	if (locale === "xh") return xh_layer_townships_label(inputs)
	if (locale === "af") return af_layer_townships_label(inputs)
	return en_layer_townships_label(inputs)
});