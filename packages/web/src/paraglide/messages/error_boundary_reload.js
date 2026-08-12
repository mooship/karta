/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_ReloadInputs */

const en_error_boundary_reload = /** @type {(inputs: Error_Boundary_ReloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reload page`)
};

const st_error_boundary_reload = /** @type {(inputs: Error_Boundary_ReloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kenya leqephe hape`)
};

const zu_error_boundary_reload = /** @type {(inputs: Error_Boundary_ReloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vula kabusha ikhasi`)
};

/**
* | output |
* | --- |
* | "Reload page" |
*
* @param {Error_Boundary_ReloadInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const error_boundary_reload = /** @type {((inputs?: Error_Boundary_ReloadInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_ReloadInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_error_boundary_reload(inputs)
	if (locale === "zu") return zu_error_boundary_reload(inputs)
	return en_error_boundary_reload(inputs)
});