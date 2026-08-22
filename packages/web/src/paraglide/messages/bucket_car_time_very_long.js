/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Car_Time_Very_LongInputs */

const en_bucket_car_time_very_long = /** @type {(inputs: Bucket_Car_Time_Very_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Very long (> 60 min)`)
};

const af_bucket_car_time_very_long = /** @type {(inputs: Bucket_Car_Time_Very_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Baie lank (> 60 min)`)
};

/**
* | output |
* | --- |
* | "Very long (> 60 min)" |
*
* @param {Bucket_Car_Time_Very_LongInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_car_time_very_long = /** @type {((inputs?: Bucket_Car_Time_Very_LongInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_Very_LongInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_car_time_very_long(inputs)
	return en_bucket_car_time_very_long(inputs)
});