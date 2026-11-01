/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Search_Location_Input_QueryInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Vrye teks-pleknaam om na te soek.")
	return /** @type {LocalizedString} */ ("Free-text place name to search for.")
});