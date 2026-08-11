/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Generic_MessageInputs */

const en_error_boundary_generic_message = /** @type {(inputs: Error_Boundary_Generic_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An unexpected error occurred. Reloading the page usually fixes it.`)
};

/**
* | output |
* | --- |
* | "An unexpected error occurred. Reloading the page usually fixes it." |
*
* @param {Error_Boundary_Generic_MessageInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const error_boundary_generic_message = /** @type {((inputs?: Error_Boundary_Generic_MessageInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Generic_MessageInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_error_boundary_generic_message(inputs)
});