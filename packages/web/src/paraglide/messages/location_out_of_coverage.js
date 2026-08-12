/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ location: NonNullable<unknown> }} Location_Out_Of_CoverageInputs */

const en_location_out_of_coverage = /** @type {(inputs: Location_Out_Of_CoverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.location} is outside South Africa.`)
};

const st_location_out_of_coverage = /** @type {(inputs: Location_Out_Of_CoverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.location} e kantle ho Aforika Borwa.`)
};

const zu_location_out_of_coverage = /** @type {(inputs: Location_Out_Of_CoverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.location} ingaphandle kweNingizimu Afrika.`)
};

const xh_location_out_of_coverage = /** @type {(inputs: Location_Out_Of_CoverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.location} ingaphandle koMzantsi Afrika.`)
};

const af_location_out_of_coverage = /** @type {(inputs: Location_Out_Of_CoverageInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.location} is buite Suid-Afrika.`)
};

/**
* | output |
* | --- |
* | "{location} is outside South Africa." |
*
* @param {Location_Out_Of_CoverageInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const location_out_of_coverage = /** @type {((inputs: Location_Out_Of_CoverageInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Out_Of_CoverageInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_location_out_of_coverage(inputs)
	if (locale === "zu") return zu_location_out_of_coverage(inputs)
	if (locale === "xh") return xh_location_out_of_coverage(inputs)
	if (locale === "af") return af_location_out_of_coverage(inputs)
	return en_location_out_of_coverage(inputs)
});