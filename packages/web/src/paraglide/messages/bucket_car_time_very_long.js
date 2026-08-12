/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Car_Time_Very_LongInputs */

const en_bucket_car_time_very_long = /** @type {(inputs: Bucket_Car_Time_Very_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Very long (> 60 min)`)
};

const st_bucket_car_time_very_long = /** @type {(inputs: Bucket_Car_Time_Very_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nako e telele haholo (> 60 min)`)
};

const zu_bucket_car_time_very_long = /** @type {(inputs: Bucket_Car_Time_Very_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isikhathi eside kakhulu (> 60 min)`)
};

const xh_bucket_car_time_very_long = /** @type {(inputs: Bucket_Car_Time_Very_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ixesha elide kakhulu (> 60 min)`)
};

/**
* | output |
* | --- |
* | "Very long (> 60 min)" |
*
* @param {Bucket_Car_Time_Very_LongInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const bucket_car_time_very_long = /** @type {((inputs?: Bucket_Car_Time_Very_LongInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_Very_LongInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_bucket_car_time_very_long(inputs)
	if (locale === "zu") return zu_bucket_car_time_very_long(inputs)
	if (locale === "xh") return xh_bucket_car_time_very_long(inputs)
	return en_bucket_car_time_very_long(inputs)
});