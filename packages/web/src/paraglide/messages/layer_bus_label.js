/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Bus_LabelInputs */

const en_layer_bus_label = /** @type {(inputs: Layer_Bus_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bus`)
};

const af_layer_bus_label = /** @type {(inputs: Layer_Bus_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bus`)
};

/**
* | output |
* | --- |
* | "Bus" |
*
* @param {Layer_Bus_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_bus_label = /** @type {((inputs?: Layer_Bus_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Bus_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_bus_label(inputs)
	return en_layer_bus_label(inputs)
});