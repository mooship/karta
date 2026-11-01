/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Not_Found_MessageInputs */



/**
* | output |
* | --- |
* | "The page you're looking for doesn't exist." |
*
* @param {Error_Boundary_Not_Found_MessageInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const error_boundary_not_found_message = /** @type {((inputs?: Error_Boundary_Not_Found_MessageInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Not_Found_MessageInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Die bladsy waarna jy soek, bestaan nie.")
	return /** @type {LocalizedString} */ ("The page you're looking for doesn't exist.")
});