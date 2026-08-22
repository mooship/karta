/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Not_Found_MessageInputs */

const en_error_boundary_not_found_message = /** @type {(inputs: Error_Boundary_Not_Found_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The page you're looking for doesn't exist.`)
};

const af_error_boundary_not_found_message = /** @type {(inputs: Error_Boundary_Not_Found_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die bladsy waarna jy soek, bestaan nie.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_error_boundary_not_found_message(inputs)
	return en_error_boundary_not_found_message(inputs)
});