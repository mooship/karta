/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Generic_TitleInputs */

const en_error_boundary_generic_title = /** @type {(inputs: Error_Boundary_Generic_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Something went wrong`)
};

const af_error_boundary_generic_title = /** @type {(inputs: Error_Boundary_Generic_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iets het verkeerd geloop`)
};

/**
* | output |
* | --- |
* | "Something went wrong" |
*
* @param {Error_Boundary_Generic_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const error_boundary_generic_title = /** @type {((inputs?: Error_Boundary_Generic_TitleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Generic_TitleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_error_boundary_generic_title(inputs)
	return en_error_boundary_generic_title(inputs)
});