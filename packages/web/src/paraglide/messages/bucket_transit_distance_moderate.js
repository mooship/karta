/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_ModerateInputs */

const en_bucket_transit_distance_moderate = /** @type {(inputs: Bucket_Transit_Distance_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moderate (1–3 km)`)
};

const st_bucket_transit_distance_moderate = /** @type {(inputs: Bucket_Transit_Distance_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bohole bo bohareng (1–3 km)`)
};

const zu_bucket_transit_distance_moderate = /** @type {(inputs: Bucket_Transit_Distance_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibanga elimaphakathi (1–3 km)`)
};

const xh_bucket_transit_distance_moderate = /** @type {(inputs: Bucket_Transit_Distance_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umgama ophakathi (1–3 km)`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_transit_distance_moderate = /** @type {((inputs?: Bucket_Transit_Distance_ModerateInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_ModerateInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_bucket_transit_distance_moderate(inputs)
	if (locale === "zu") return zu_bucket_transit_distance_moderate(inputs)
	if (locale === "xh") return xh_bucket_transit_distance_moderate(inputs)
	if (locale === "af") return af_bucket_transit_distance_moderate(inputs)
	return en_bucket_transit_distance_moderate(inputs)
});