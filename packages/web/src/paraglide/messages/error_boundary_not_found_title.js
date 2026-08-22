/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Not_Found_TitleInputs */

const en_error_boundary_not_found_title = /** @type {(inputs: Error_Boundary_Not_Found_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Page not found`)
};

const af_error_boundary_not_found_title = /** @type {(inputs: Error_Boundary_Not_Found_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bladsy nie gevind nie`)
};

/**
* | output |
* | --- |
* | "Page not found" |
*
* @param {Error_Boundary_Not_Found_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const error_boundary_not_found_title = /** @type {((inputs?: Error_Boundary_Not_Found_TitleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Not_Found_TitleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_error_boundary_not_found_title(inputs)
	return en_error_boundary_not_found_title(inputs)
});