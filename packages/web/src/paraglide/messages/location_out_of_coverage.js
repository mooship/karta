/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ location: NonNullable<unknown> }} Location_Out_Of_CoverageInputs */



/**
* | output |
* | --- |
* | "{location} is outside South Africa." |
*
* @param {Location_Out_Of_CoverageInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const location_out_of_coverage = /** @type {((inputs: Location_Out_Of_CoverageInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Out_Of_CoverageInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`${i?.location} is buite Suid-Afrika.`)
	return /** @type {LocalizedString} */ (`${i?.location} is outside South Africa.`)
});