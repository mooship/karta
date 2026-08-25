/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Tollgates_LabelInputs */

const en_layer_tollgates_label = /** @type {(inputs: Layer_Tollgates_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toll plazas`)
};

const af_layer_tollgates_label = /** @type {(inputs: Layer_Tollgates_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tolhekke`)
};

/**
* | output |
* | --- |
* | "Toll plazas" |
*
* @param {Layer_Tollgates_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_tollgates_label = /** @type {((inputs?: Layer_Tollgates_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Tollgates_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_tollgates_label(inputs)
	return en_layer_tollgates_label(inputs)
});