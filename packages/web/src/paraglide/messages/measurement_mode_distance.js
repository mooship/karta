/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_Mode_DistanceInputs */

const en_measurement_mode_distance = /** @type {(inputs: Measurement_Mode_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Distance`)
};

const af_measurement_mode_distance = /** @type {(inputs: Measurement_Mode_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afstand`)
};

/**
* | output |
* | --- |
* | "Distance" |
*
* @param {Measurement_Mode_DistanceInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_mode_distance = /** @type {((inputs?: Measurement_Mode_DistanceInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Mode_DistanceInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_measurement_mode_distance(inputs)
	return en_measurement_mode_distance(inputs)
});