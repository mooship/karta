/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Spatial_Burden_LowInputs */

const en_bucket_spatial_burden_low = /** @type {(inputs: Bucket_Spatial_Burden_LowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Low`)
};

const af_bucket_spatial_burden_low = /** @type {(inputs: Bucket_Spatial_Burden_LowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Laag`)
};

/**
* | output |
* | --- |
* | "Low" |
*
* @param {Bucket_Spatial_Burden_LowInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_spatial_burden_low = /** @type {((inputs?: Bucket_Spatial_Burden_LowInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Spatial_Burden_LowInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_spatial_burden_low(inputs)
	return en_bucket_spatial_burden_low(inputs)
});