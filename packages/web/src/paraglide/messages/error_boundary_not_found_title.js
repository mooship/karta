/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Not_Found_TitleInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Bladsy nie gevind nie")
	return /** @type {LocalizedString} */ ("Page not found")
});