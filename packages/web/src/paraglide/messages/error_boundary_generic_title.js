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

const xh_error_boundary_generic_title = /** @type {(inputs: Error_Boundary_Generic_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kukho into engahambanga kakuhle`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const error_boundary_generic_title = /** @type {((inputs?: Error_Boundary_Generic_TitleInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Generic_TitleInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_error_boundary_generic_title(inputs)
	if (locale === "zu") return zu_error_boundary_generic_title(inputs)
	if (locale === "xh") return xh_error_boundary_generic_title(inputs)
	if (locale === "af") return af_error_boundary_generic_title(inputs)
	return en_error_boundary_generic_title(inputs)
});