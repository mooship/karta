/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Search_Location_DescriptionInputs */



/**
* | output |
* | --- |
* | "Search for a place by name and fly the map to the best match, e.g. a town, suburb or station." |
*
* @param {Webmcp_Search_Location_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_search_location_description = /** @type {((inputs?: Webmcp_Search_Location_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Soek 'n plek op naam en beweeg die kaart na die beste passing, bv. 'n dorp, voorstad of stasie.")
	return /** @type {LocalizedString} */ ("Search for a place by name and fly the map to the best match, e.g. a town, suburb or station.")
});