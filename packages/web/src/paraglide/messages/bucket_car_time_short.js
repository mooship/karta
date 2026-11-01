/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Car_Time_ShortInputs */



/**
* | output |
* | --- |
* | "Short (≤ 20 min)" |
*
* @param {Bucket_Car_Time_ShortInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_car_time_short = /** @type {((inputs?: Bucket_Car_Time_ShortInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_ShortInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Kort (≤ 20 min)")
	return /** @type {LocalizedString} */ ("Short (≤ 20 min)")
});