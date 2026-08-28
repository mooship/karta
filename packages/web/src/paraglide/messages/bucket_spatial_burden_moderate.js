/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Spatial_Burden_ModerateInputs */

const en_bucket_spatial_burden_moderate = /** @type {(inputs: Bucket_Spatial_Burden_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moderate`)
};

const af_bucket_spatial_burden_moderate = /** @type {(inputs: Bucket_Spatial_Burden_ModerateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matig`)
};

/**
* | output |
* | --- |
* | "Moderate" |
*
* @param {Bucket_Spatial_Burden_ModerateInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const bucket_spatial_burden_moderate = /** @type {((inputs?: Bucket_Spatial_Burden_ModerateInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Spatial_Burden_ModerateInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_bucket_spatial_burden_moderate(inputs)
	return en_bucket_spatial_burden_moderate(inputs)
});