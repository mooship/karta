/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_ModerateInputs */



/**
* | output |
* | --- |
* | "Moderate (1–3 km)" |
*
* @param {Bucket_Transit_Distance_ModerateInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_transit_distance_moderate = /** @type {((inputs?: Bucket_Transit_Distance_ModerateInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_ModerateInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Matig (1–3 km)")
	return /** @type {LocalizedString} */ ("Moderate (1–3 km)")
});