/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skip_To_Map_InformationInputs */



/**
* | output |
* | --- |
* | "Skip to map information" |
*
* @param {Skip_To_Map_InformationInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const skip_to_map_information = /** @type {((inputs?: Skip_To_Map_InformationInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skip_To_Map_InformationInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Spring na kaartinligting")
	return /** @type {LocalizedString} */ ("Skip to map information")
});