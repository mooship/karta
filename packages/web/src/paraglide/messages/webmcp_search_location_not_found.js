/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ query: NonNullable<unknown> }} Webmcp_Search_Location_Not_FoundInputs */

const en_webmcp_search_location_not_found = /** @type {(inputs: Webmcp_Search_Location_Not_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No location found matching "${i?.query}".`)
};

const af_webmcp_search_location_not_found = /** @type {(inputs: Webmcp_Search_Location_Not_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Geen plek gevind wat by "${i?.query}" pas nie.`)
};

/**
* | output |
* | --- |
* | "No location found matching \"{query}\"." |
*
* @param {Webmcp_Search_Location_Not_FoundInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_search_location_not_found = /** @type {((inputs: Webmcp_Search_Location_Not_FoundInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_Not_FoundInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_search_location_not_found(inputs)
	return en_webmcp_search_location_not_found(inputs)
});