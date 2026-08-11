/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Boundary_ReloadInputs */

const en_error_boundary_reload = /** @type {(inputs: Error_Boundary_ReloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reload page`)
};

/**
* | output |
* | --- |
* | "Reload page" |
*
* @param {Error_Boundary_ReloadInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const error_boundary_reload = /** @type {((inputs?: Error_Boundary_ReloadInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_ReloadInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_error_boundary_reload(inputs)
});