/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Car_Time_ShortInputs */

const en_bucket_car_time_short = /** @type {(inputs: Bucket_Car_Time_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Short (≤ 20 min)`)
};

const st_bucket_car_time_short = /** @type {(inputs: Bucket_Car_Time_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nako e khutshwane (≤ 20 min)`)
};

const zu_bucket_car_time_short = /** @type {(inputs: Bucket_Car_Time_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isikhathi esifushane (≤ 20 min)`)
};

const xh_bucket_car_time_short = /** @type {(inputs: Bucket_Car_Time_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ixesha elifutshane (≤ 20 min)`)
};

const af_bucket_car_time_short = /** @type {(inputs: Bucket_Car_Time_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kort (≤ 20 min)`)
};

/**
* | output |
* | --- |
* | "Short (≤ 20 min)" |
*
* @param {Bucket_Car_Time_ShortInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_car_time_short = /** @type {((inputs?: Bucket_Car_Time_ShortInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_ShortInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_bucket_car_time_short(inputs)
	if (locale === "zu") return zu_bucket_car_time_short(inputs)
	if (locale === "xh") return xh_bucket_car_time_short(inputs)
	if (locale === "af") return af_bucket_car_time_short(inputs)
	return en_bucket_car_time_short(inputs)
});