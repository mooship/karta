/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_ModerateInputs */

const en_bucket_transit_distance_moderate = /** @type {(inputs: Bucket_Transit_Distance_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moderate (1–3 km)`)
};

const af_bucket_transit_distance_moderate = /** @type {(inputs: Bucket_Transit_Distance_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matig (1–3 km)`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_transit_distance_moderate(inputs)
	return en_bucket_transit_distance_moderate(inputs)
});