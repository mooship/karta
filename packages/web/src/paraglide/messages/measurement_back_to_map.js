/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_Back_To_MapInputs */

const en_measurement_back_to_map = /** @type {(inputs: Measurement_Back_To_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Back to map`)
};

const af_measurement_back_to_map = /** @type {(inputs: Measurement_Back_To_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terug na kaart`)
};

/**
* | output |
* | --- |
* | "Back to map" |
*
* @param {Measurement_Back_To_MapInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_back_to_map = /** @type {((inputs?: Measurement_Back_To_MapInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Back_To_MapInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_measurement_back_to_map(inputs)
	return en_measurement_back_to_map(inputs)
});