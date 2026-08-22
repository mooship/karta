/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_ToggleInputs */

const en_measurement_toggle = /** @type {(inputs: Measurement_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Measure distance and area`)
};

const af_measurement_toggle = /** @type {(inputs: Measurement_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Meet afstand en area`)
};

/**
* | output |
* | --- |
* | "Measure distance and area" |
*
* @param {Measurement_ToggleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_toggle = /** @type {((inputs?: Measurement_ToggleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_ToggleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_measurement_toggle(inputs)
	return en_measurement_toggle(inputs)
});