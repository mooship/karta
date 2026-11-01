/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Location_Context_Menu_FailedInputs */



/**
* | output |
* | --- |
* | "Couldn't look up this address." |
*
* @param {Location_Context_Menu_FailedInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const location_context_menu_failed = /** @type {((inputs?: Location_Context_Menu_FailedInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_FailedInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Kon nie hierdie adres opsoek nie.")
	return /** @type {LocalizedString} */ ("Couldn't look up this address.")
});