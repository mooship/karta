/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Car_Time_LongInputs */

const en_bucket_car_time_long = /** @type {(inputs: Bucket_Car_Time_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Long (41–60 min)`)
};

const af_bucket_car_time_long = /** @type {(inputs: Bucket_Car_Time_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lank (41–60 min)`)
};

/**
* | output |
* | --- |
* | "Long (41–60 min)" |
*
* @param {Bucket_Car_Time_LongInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_car_time_long = /** @type {((inputs?: Bucket_Car_Time_LongInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_LongInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_car_time_long(inputs)
	return en_bucket_car_time_long(inputs)
});