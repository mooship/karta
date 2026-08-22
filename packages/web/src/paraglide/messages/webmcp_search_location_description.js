/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Search_Location_DescriptionInputs */

const en_webmcp_search_location_description = /** @type {(inputs: Webmcp_Search_Location_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search for a place by name and fly the map to the best match, e.g. a town, suburb or station.`)
};

const af_webmcp_search_location_description = /** @type {(inputs: Webmcp_Search_Location_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Soek 'n plek op naam en beweeg die kaart na die beste passing, bv. 'n dorp, voorstad of stasie.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_search_location_description(inputs)
	return en_webmcp_search_location_description(inputs)
});