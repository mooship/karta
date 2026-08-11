/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Not_Found_MessageInputs */

const en_error_boundary_not_found_message = /** @type {(inputs: Error_Boundary_Not_Found_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The page you're looking for doesn't exist.`)
};

/**
* | output |
* | --- |
* | "The page you're looking for doesn't exist." |
*
* @param {Error_Boundary_Not_Found_MessageInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const error_boundary_not_found_message = /** @type {((inputs?: Error_Boundary_Not_Found_MessageInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Not_Found_MessageInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_error_boundary_not_found_message(inputs)
});