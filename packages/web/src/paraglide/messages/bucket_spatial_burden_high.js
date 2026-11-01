/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bucket_Spatial_Burden_HighInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Hoog")
	return /** @type {LocalizedString} */ ("High")
});