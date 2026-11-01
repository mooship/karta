/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_NearInputs */



/**
* | output |
* | --- |
* | "Near (≤ 1 km)" |
*
* @param {Bucket_Transit_Distance_NearInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_transit_distance_near = /** @type {((inputs?: Bucket_Transit_Distance_NearInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_NearInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Naby (≤ 1 km)")
	return /** @type {LocalizedString} */ ("Near (≤ 1 km)")
});