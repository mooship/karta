/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Generic_MessageInputs */

const en_error_boundary_generic_message = /** @type {(inputs: Error_Boundary_Generic_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An unexpected error occurred. Reloading the page usually fixes it.`)
};

const af_error_boundary_generic_message = /** @type {(inputs: Error_Boundary_Generic_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`'n Onverwagte fout het voorgekom. Die herlaai van die bladsy los gewoonlik die probleem op.`)
};

/**
* | output |
* | --- |
* | "An unexpected error occurred. Reloading the page usually fixes it." |
*
* @param {Error_Boundary_Generic_MessageInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const error_boundary_generic_message = /** @type {((inputs?: Error_Boundary_Generic_MessageInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Generic_MessageInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_error_boundary_generic_message(inputs)
	return en_error_boundary_generic_message(inputs)
});