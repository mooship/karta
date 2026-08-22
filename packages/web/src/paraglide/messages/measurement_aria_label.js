/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_Aria_LabelInputs */

const en_measurement_aria_label = /** @type {(inputs: Measurement_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Measurement tool`)
};

const af_measurement_aria_label = /** @type {(inputs: Measurement_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Meetnutsding`)
};

/**
* | output |
* | --- |
* | "Measurement tool" |
*
* @param {Measurement_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_aria_label = /** @type {((inputs?: Measurement_Aria_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Aria_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_measurement_aria_label(inputs)
	return en_measurement_aria_label(inputs)
});