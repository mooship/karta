/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_NearInputs */

const en_bucket_transit_distance_near = /** @type {(inputs: Bucket_Transit_Distance_NearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Near (≤ 1 km)`)
};

const af_bucket_transit_distance_near = /** @type {(inputs: Bucket_Transit_Distance_NearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Naby (≤ 1 km)`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_transit_distance_near(inputs)
	return en_bucket_transit_distance_near(inputs)
});