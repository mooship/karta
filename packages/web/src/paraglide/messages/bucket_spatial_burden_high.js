/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Spatial_Burden_HighInputs */

const en_bucket_spatial_burden_high = /** @type {(inputs: Bucket_Spatial_Burden_HighInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`High`)
};

const af_bucket_spatial_burden_high = /** @type {(inputs: Bucket_Spatial_Burden_HighInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hoog`)
};

/**
* | output |
* | --- |
* | "High" |
*
* @param {Bucket_Spatial_Burden_HighInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_spatial_burden_high = /** @type {((inputs?: Bucket_Spatial_Burden_HighInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Spatial_Burden_HighInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_spatial_burden_high(inputs)
	return en_bucket_spatial_burden_high(inputs)
});