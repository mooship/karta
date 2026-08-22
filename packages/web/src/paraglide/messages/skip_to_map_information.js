/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skip_To_Map_InformationInputs */

const en_skip_to_map_information = /** @type {(inputs: Skip_To_Map_InformationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skip to map information`)
};

const af_skip_to_map_information = /** @type {(inputs: Skip_To_Map_InformationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Spring na kaartinligting`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_skip_to_map_information(inputs)
	return en_skip_to_map_information(inputs)
});