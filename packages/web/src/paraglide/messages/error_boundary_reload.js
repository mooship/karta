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

const xh_error_boundary_reload = /** @type {(inputs: Error_Boundary_ReloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vula iphepha kwakhona`)
};

const af_error_boundary_reload = /** @type {(inputs: Error_Boundary_ReloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Herlaai bladsy`)
};

/**
* | output |
* | --- |
* | "Reload page" |
*
* @param {Error_Boundary_ReloadInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const error_boundary_reload = /** @type {((inputs?: Error_Boundary_ReloadInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_ReloadInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_error_boundary_reload(inputs)
	if (locale === "zu") return zu_error_boundary_reload(inputs)
	if (locale === "xh") return xh_error_boundary_reload(inputs)
	if (locale === "af") return af_error_boundary_reload(inputs)
	return en_error_boundary_reload(inputs)
});