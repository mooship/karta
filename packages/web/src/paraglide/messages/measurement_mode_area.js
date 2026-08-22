/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_Mode_AreaInputs */

const en_measurement_mode_area = /** @type {(inputs: Measurement_Mode_AreaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Area`)
};

const af_measurement_mode_area = /** @type {(inputs: Measurement_Mode_AreaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Area`)
};

/**
* | output |
* | --- |
* | "Area" |
*
* @param {Measurement_Mode_AreaInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_mode_area = /** @type {((inputs?: Measurement_Mode_AreaInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Mode_AreaInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_measurement_mode_area(inputs)
	return en_measurement_mode_area(inputs)
});