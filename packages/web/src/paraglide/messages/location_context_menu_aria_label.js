/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Location_Context_Menu_Aria_LabelInputs */

const en_location_context_menu_aria_label = /** @type {(inputs: Location_Context_Menu_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map location actions`)
};

const af_location_context_menu_aria_label = /** @type {(inputs: Location_Context_Menu_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kaartligging-aksies`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_location_context_menu_aria_label(inputs)
	return en_location_context_menu_aria_label(inputs)
});