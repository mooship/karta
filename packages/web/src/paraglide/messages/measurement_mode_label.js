/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_Mode_LabelInputs */

const en_measurement_mode_label = /** @type {(inputs: Measurement_Mode_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Measurement mode`)
};

const af_measurement_mode_label = /** @type {(inputs: Measurement_Mode_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Meetmodus`)
};

/**
* | output |
* | --- |
* | "Measurement mode" |
*
* @param {Measurement_Mode_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_mode_label = /** @type {((inputs?: Measurement_Mode_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Mode_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_measurement_mode_label(inputs)
	return en_measurement_mode_label(inputs)
});