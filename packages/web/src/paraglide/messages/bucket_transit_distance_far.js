/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_FarInputs */

const en_bucket_transit_distance_far = /** @type {(inputs: Bucket_Transit_Distance_FarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Far (3–8 km)`)
};

const st_bucket_transit_distance_far = /** @type {(inputs: Bucket_Transit_Distance_FarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bohole bo hole (3–8 km)`)
};

const zu_bucket_transit_distance_far = /** @type {(inputs: Bucket_Transit_Distance_FarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibanga elikude (3–8 km)`)
};

const xh_bucket_transit_distance_far = /** @type {(inputs: Bucket_Transit_Distance_FarInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umgama okude (3–8 km)`)
};

/**
* | output |
* | --- |
* | "Far (3–8 km)" |
*
* @param {Bucket_Transit_Distance_FarInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const bucket_transit_distance_far = /** @type {((inputs?: Bucket_Transit_Distance_FarInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_FarInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_bucket_transit_distance_far(inputs)
	if (locale === "zu") return zu_bucket_transit_distance_far(inputs)
	if (locale === "xh") return xh_bucket_transit_distance_far(inputs)
	return en_bucket_transit_distance_far(inputs)
});