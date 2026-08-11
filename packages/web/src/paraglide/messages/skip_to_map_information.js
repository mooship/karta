/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skip_To_Map_InformationInputs */

const en_skip_to_map_information = /** @type {(inputs: Skip_To_Map_InformationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skip to map information`)
};

/**
* | output |
* | --- |
* | "Skip to map information" |
*
* @param {Skip_To_Map_InformationInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const skip_to_map_information = /** @type {((inputs?: Skip_To_Map_InformationInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skip_To_Map_InformationInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_skip_to_map_information(inputs)
});