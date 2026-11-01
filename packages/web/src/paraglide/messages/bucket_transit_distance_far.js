/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_FarInputs */



/**
* | output |
* | --- |
* | "Far (3–8 km)" |
*
* @param {Bucket_Transit_Distance_FarInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_transit_distance_far = /** @type {((inputs?: Bucket_Transit_Distance_FarInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_FarInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Ver (3–8 km)")
	return /** @type {LocalizedString} */ ("Far (3–8 km)")
});