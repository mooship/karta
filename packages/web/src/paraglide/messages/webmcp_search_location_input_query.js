/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Search_Location_Input_QueryInputs */

const en_webmcp_search_location_input_query = /** @type {(inputs: Webmcp_Search_Location_Input_QueryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Free-text place name to search for.`)
};

const af_webmcp_search_location_input_query = /** @type {(inputs: Webmcp_Search_Location_Input_QueryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vrye teks-pleknaam om na te soek.`)
};

/**
* | output |
* | --- |
* | "Free-text place name to search for." |
*
* @param {Webmcp_Search_Location_Input_QueryInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_search_location_input_query = /** @type {((inputs?: Webmcp_Search_Location_Input_QueryInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_Input_QueryInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_search_location_input_query(inputs)
	return en_webmcp_search_location_input_query(inputs)
});