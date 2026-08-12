/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Skip_To_Map_InformationInputs */

const en_skip_to_map_information = /** @type {(inputs: Skip_To_Map_InformationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skip to map information`)
};

const st_skip_to_map_information = /** @type {(inputs: Skip_To_Map_InformationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tlola o ye tlhahisoleseding ya 'mapa`)
};

const zu_skip_to_map_information = /** @type {(inputs: Skip_To_Map_InformationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yeqa uye olwazini lwebalazwe`)
};

/**
* | output |
* | --- |
* | "Skip to map information" |
*
* @param {Skip_To_Map_InformationInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const skip_to_map_information = /** @type {((inputs?: Skip_To_Map_InformationInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Skip_To_Map_InformationInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_skip_to_map_information(inputs)
	if (locale === "zu") return zu_skip_to_map_information(inputs)
	return en_skip_to_map_information(inputs)
});