/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Bus_LabelInputs */

const en_layer_bus_label = /** @type {(inputs: Layer_Bus_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bus`)
};

const st_layer_bus_label = /** @type {(inputs: Layer_Bus_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bese`)
};

const zu_layer_bus_label = /** @type {(inputs: Layer_Bus_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibhasi`)
};

const xh_layer_bus_label = /** @type {(inputs: Layer_Bus_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibhasi`)
};

/**
* | output |
* | --- |
* | "Bus" |
*
* @param {Layer_Bus_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const layer_bus_label = /** @type {((inputs?: Layer_Bus_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Bus_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_bus_label(inputs)
	if (locale === "zu") return zu_layer_bus_label(inputs)
	if (locale === "xh") return xh_layer_bus_label(inputs)
	return en_layer_bus_label(inputs)
});