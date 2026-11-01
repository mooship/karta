/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_Very_FarInputs */



/**
* | output |
* | --- |
* | "Very far (> 8 km)" |
*
* @param {Bucket_Transit_Distance_Very_FarInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_transit_distance_very_far = /** @type {((inputs?: Bucket_Transit_Distance_Very_FarInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_Very_FarInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Baie ver (> 8 km)")
	return /** @type {LocalizedString} */ ("Very far (> 8 km)")
});