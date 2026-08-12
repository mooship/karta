/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Car_Time_LongInputs */

const en_bucket_car_time_long = /** @type {(inputs: Bucket_Car_Time_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Long (41–60 min)`)
};

const st_bucket_car_time_long = /** @type {(inputs: Bucket_Car_Time_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nako e telele (41–60 min)`)
};

const zu_bucket_car_time_long = /** @type {(inputs: Bucket_Car_Time_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isikhathi eside (41–60 min)`)
};

const xh_bucket_car_time_long = /** @type {(inputs: Bucket_Car_Time_LongInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ixesha elide (41–60 min)`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_car_time_long = /** @type {((inputs?: Bucket_Car_Time_LongInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_LongInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_bucket_car_time_long(inputs)
	if (locale === "zu") return zu_bucket_car_time_long(inputs)
	if (locale === "xh") return xh_bucket_car_time_long(inputs)
	if (locale === "af") return af_bucket_car_time_long(inputs)
	return en_bucket_car_time_long(inputs)
});