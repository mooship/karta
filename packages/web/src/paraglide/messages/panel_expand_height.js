/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Expand_HeightInputs */



/**
* | output |
* | --- |
* | "Expand panel height" |
*
* @param {Panel_Expand_HeightInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_expand_height = /** @type {((inputs?: Panel_Expand_HeightInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Expand_HeightInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Vergroot paneelhoogte")
	return /** @type {LocalizedString} */ ("Expand panel height")
});