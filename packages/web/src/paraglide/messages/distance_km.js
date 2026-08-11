/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ value: NonNullable<unknown> }} Distance_KmInputs */

const en_distance_km = /** @type {(inputs: Distance_KmInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.value} km`)
};

/**
* | output |
* | --- |
* | "{value} km" |
*
* @param {Distance_KmInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const distance_km = /** @type {((inputs: Distance_KmInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Distance_KmInputs, { locale?: "en" }, {}>} */ ((inputs, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_distance_km(inputs)
});