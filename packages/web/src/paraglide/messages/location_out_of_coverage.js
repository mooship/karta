/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ location: NonNullable<unknown> }} Location_Out_Of_CoverageInputs */

const en_location_out_of_coverage = /** @type {(inputs: Location_Out_Of_CoverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.location} is outside South Africa.`)
};

/**
* | output |
* | --- |
* | "{location} is outside South Africa." |
*
* @param {Location_Out_Of_CoverageInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const location_out_of_coverage = /** @type {((inputs: Location_Out_Of_CoverageInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Out_Of_CoverageInputs, { locale?: "en" }, {}>} */ ((inputs, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_location_out_of_coverage(inputs)
});