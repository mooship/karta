/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_ReloadInputs */

const en_error_boundary_reload = /** @type {(inputs: Error_Boundary_ReloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reload page`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const error_boundary_reload = /** @type {((inputs?: Error_Boundary_ReloadInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_ReloadInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_error_boundary_reload(inputs)
	return en_error_boundary_reload(inputs)
});