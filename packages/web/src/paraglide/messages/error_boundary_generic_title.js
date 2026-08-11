/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Generic_TitleInputs */

const en_error_boundary_generic_title = /** @type {(inputs: Error_Boundary_Generic_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Something went wrong`)
};

/**
* | output |
* | --- |
* | "Something went wrong" |
*
* @param {Error_Boundary_Generic_TitleInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const error_boundary_generic_title = /** @type {((inputs?: Error_Boundary_Generic_TitleInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Generic_TitleInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_error_boundary_generic_title(inputs)
});