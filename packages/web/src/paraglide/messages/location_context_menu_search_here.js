/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Location_Context_Menu_Search_HereInputs */

const en_location_context_menu_search_here = /** @type {(inputs: Location_Context_Menu_Search_HereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search this location`)
};

const af_location_context_menu_search_here = /** @type {(inputs: Location_Context_Menu_Search_HereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Soek hierdie ligging`)
};

/**
* | output |
* | --- |
* | "Search this location" |
*
* @param {Location_Context_Menu_Search_HereInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const location_context_menu_search_here = /** @type {((inputs?: Location_Context_Menu_Search_HereInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_Search_HereInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_location_context_menu_search_here(inputs)
	return en_location_context_menu_search_here(inputs)
});