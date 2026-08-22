/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_Very_FarInputs */

const en_bucket_transit_distance_very_far = /** @type {(inputs: Bucket_Transit_Distance_Very_FarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Very far (> 8 km)`)
};

const af_bucket_transit_distance_very_far = /** @type {(inputs: Bucket_Transit_Distance_Very_FarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Baie ver (> 8 km)`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_transit_distance_very_far(inputs)
	return en_bucket_transit_distance_very_far(inputs)
});