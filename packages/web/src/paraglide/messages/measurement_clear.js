/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_ClearInputs */

const en_measurement_clear = /** @type {(inputs: Measurement_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear`)
};

const af_measurement_clear = /** @type {(inputs: Measurement_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maak skoon`)
};

/**
* | output |
* | --- |
* | "Clear" |
*
* @param {Measurement_ClearInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_clear = /** @type {((inputs?: Measurement_ClearInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_ClearInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_measurement_clear(inputs)
	return en_measurement_clear(inputs)
});