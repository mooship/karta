/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Spatial_Burden_SevereInputs */

const en_bucket_spatial_burden_severe = /** @type {(inputs: Bucket_Spatial_Burden_SevereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Severe`)
};

const af_bucket_spatial_burden_severe = /** @type {(inputs: Bucket_Spatial_Burden_SevereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ernstig`)
};

/**
* | output |
* | --- |
* | "Severe" |
*
* @param {Bucket_Spatial_Burden_SevereInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_spatial_burden_severe = /** @type {((inputs?: Bucket_Spatial_Burden_SevereInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Spatial_Burden_SevereInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_spatial_burden_severe(inputs)
	return en_bucket_spatial_burden_severe(inputs)
});