/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Car_Time_ModerateInputs */

const en_bucket_car_time_moderate = /** @type {(inputs: Bucket_Car_Time_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moderate (21–40 min)`)
};

const st_bucket_car_time_moderate = /** @type {(inputs: Bucket_Car_Time_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nako e bohareng (21–40 min)`)
};

const zu_bucket_car_time_moderate = /** @type {(inputs: Bucket_Car_Time_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isikhathi esimaphakathi (21–40 min)`)
};

const xh_bucket_car_time_moderate = /** @type {(inputs: Bucket_Car_Time_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ixesha eliphakathi (21–40 min)`)
};

/**
* | output |
* | --- |
* | "Moderate (21–40 min)" |
*
* @param {Bucket_Car_Time_ModerateInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const bucket_car_time_moderate = /** @type {((inputs?: Bucket_Car_Time_ModerateInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_ModerateInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_bucket_car_time_moderate(inputs)
	if (locale === "zu") return zu_bucket_car_time_moderate(inputs)
	if (locale === "xh") return xh_bucket_car_time_moderate(inputs)
	return en_bucket_car_time_moderate(inputs)
});