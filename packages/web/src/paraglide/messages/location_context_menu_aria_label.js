/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Location_Context_Menu_Aria_LabelInputs */



/**
* | output |
* | --- |
* | "Map location actions" |
*
* @param {Location_Context_Menu_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const location_context_menu_aria_label = /** @type {((inputs?: Location_Context_Menu_Aria_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_Aria_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Kaartligging-aksies")
	return /** @type {LocalizedString} */ ("Map location actions")
});