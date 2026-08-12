/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_Not_Found_MessageInputs */

const en_error_boundary_not_found_message = /** @type {(inputs: Error_Boundary_Not_Found_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The page you're looking for doesn't exist.`)
};

const st_error_boundary_not_found_message = /** @type {(inputs: Error_Boundary_Not_Found_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leqephe leo o le batlang ha le teng.`)
};

const zu_error_boundary_not_found_message = /** @type {(inputs: Error_Boundary_Not_Found_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ikhasi olifunayo alikho.`)
};

const xh_error_boundary_not_found_message = /** @type {(inputs: Error_Boundary_Not_Found_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iphepha olifunayo alikho.`)
};

/**
* | output |
* | --- |
* | "The page you're looking for doesn't exist." |
*
* @param {Error_Boundary_Not_Found_MessageInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const error_boundary_not_found_message = /** @type {((inputs?: Error_Boundary_Not_Found_MessageInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Not_Found_MessageInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_error_boundary_not_found_message(inputs)
	if (locale === "zu") return zu_error_boundary_not_found_message(inputs)
	if (locale === "xh") return xh_error_boundary_not_found_message(inputs)
	return en_error_boundary_not_found_message(inputs)
});