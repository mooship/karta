/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Transit_Distance_NearInputs */

const en_bucket_transit_distance_near = /** @type {(inputs: Bucket_Transit_Distance_NearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Near (≤ 1 km)`)
};

const st_bucket_transit_distance_near = /** @type {(inputs: Bucket_Transit_Distance_NearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bohole bo haufi (≤ 1 km)`)
};

const zu_bucket_transit_distance_near = /** @type {(inputs: Bucket_Transit_Distance_NearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibanga eliseduze (≤ 1 km)`)
};

const xh_bucket_transit_distance_near = /** @type {(inputs: Bucket_Transit_Distance_NearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umgama okufuphi (≤ 1 km)`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_transit_distance_near = /** @type {((inputs?: Bucket_Transit_Distance_NearInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_NearInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_bucket_transit_distance_near(inputs)
	if (locale === "zu") return zu_bucket_transit_distance_near(inputs)
	if (locale === "xh") return xh_bucket_transit_distance_near(inputs)
	if (locale === "af") return af_bucket_transit_distance_near(inputs)
	return en_bucket_transit_distance_near(inputs)
});