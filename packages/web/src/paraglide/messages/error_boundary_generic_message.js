/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Generic_MessageInputs */

const en_error_boundary_generic_message = /** @type {(inputs: Error_Boundary_Generic_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An unexpected error occurred. Reloading the page usually fixes it.`)
};

const st_error_boundary_generic_message = /** @type {(inputs: Error_Boundary_Generic_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ho bile le phoso e sa lebellwang. Ho kenya leqephe hape hangata ho lokisa bothata.`)
};

const zu_error_boundary_generic_message = /** @type {(inputs: Error_Boundary_Generic_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kwenzeke iphutha elingalindelekile. Ukuvula kabusha ikhasi ngokuvamile kuyakulungisa.`)
};

/**
* | output |
* | --- |
* | "An unexpected error occurred. Reloading the page usually fixes it." |
*
* @param {Error_Boundary_Generic_MessageInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const error_boundary_generic_message = /** @type {((inputs?: Error_Boundary_Generic_MessageInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Generic_MessageInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_error_boundary_generic_message(inputs)
	if (locale === "zu") return zu_error_boundary_generic_message(inputs)
	return en_error_boundary_generic_message(inputs)
});