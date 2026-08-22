/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Car_Time_ModerateInputs */

const en_bucket_car_time_moderate = /** @type {(inputs: Bucket_Car_Time_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moderate (21–40 min)`)
};

const af_bucket_car_time_moderate = /** @type {(inputs: Bucket_Car_Time_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matig (21–40 min)`)
};

/**
* | output |
* | --- |
* | "Moderate (21–40 min)" |
*
* @param {Bucket_Car_Time_ModerateInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_car_time_moderate = /** @type {((inputs?: Bucket_Car_Time_ModerateInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_ModerateInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_car_time_moderate(inputs)
	return en_bucket_car_time_moderate(inputs)
});