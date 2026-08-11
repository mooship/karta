/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Generic_TitleInputs */

const en_error_boundary_generic_title = /** @type {(inputs: Error_Boundary_Generic_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Something went wrong`)
};

const st_error_boundary_generic_title = /** @type {(inputs: Error_Boundary_Generic_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ho na le se sa lokang`)
};

const zu_error_boundary_generic_title = /** @type {(inputs: Error_Boundary_Generic_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kukhona okungahambanga kahle`)
};

/**
* | output |
* | --- |
* | "Something went wrong" |
*
* @param {Error_Boundary_Generic_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const error_boundary_generic_title = /** @type {((inputs?: Error_Boundary_Generic_TitleInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Generic_TitleInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_error_boundary_generic_title(inputs)
	if (locale === "zu") return zu_error_boundary_generic_title(inputs)
	return en_error_boundary_generic_title(inputs)
});