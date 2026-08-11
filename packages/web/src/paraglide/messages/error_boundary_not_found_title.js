/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Not_Found_TitleInputs */

const en_error_boundary_not_found_title = /** @type {(inputs: Error_Boundary_Not_Found_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Page not found`)
};

const st_error_boundary_not_found_title = /** @type {(inputs: Error_Boundary_Not_Found_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leqephe ha le a fumanwa`)
};

const zu_error_boundary_not_found_title = /** @type {(inputs: Error_Boundary_Not_Found_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ikhasi alitholakali`)
};

/**
* | output |
* | --- |
* | "Page not found" |
*
* @param {Error_Boundary_Not_Found_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const error_boundary_not_found_title = /** @type {((inputs?: Error_Boundary_Not_Found_TitleInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Not_Found_TitleInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_error_boundary_not_found_title(inputs)
	if (locale === "zu") return zu_error_boundary_not_found_title(inputs)
	return en_error_boundary_not_found_title(inputs)
});