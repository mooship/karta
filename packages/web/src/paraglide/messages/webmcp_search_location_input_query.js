/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Search_Location_Input_QueryInputs */

const en_webmcp_search_location_input_query = /** @type {(inputs: Webmcp_Search_Location_Input_QueryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Free-text place name to search for.`)
};

const st_webmcp_search_location_input_query = /** @type {(inputs: Webmcp_Search_Location_Input_QueryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lebitso la sebaka le lokolohileng leo u le batlang.`)
};

const zu_webmcp_search_location_input_query = /** @type {(inputs: Webmcp_Search_Location_Input_QueryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Igama lendawo elikhululekile ozolisesha.`)
};

const xh_webmcp_search_location_input_query = /** @type {(inputs: Webmcp_Search_Location_Input_QueryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Igama lendawo elikhululekileyo ophanda ngalo.`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_search_location_input_query = /** @type {((inputs?: Webmcp_Search_Location_Input_QueryInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_Input_QueryInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_search_location_input_query(inputs)
	if (locale === "zu") return zu_webmcp_search_location_input_query(inputs)
	if (locale === "xh") return xh_webmcp_search_location_input_query(inputs)
	if (locale === "af") return af_webmcp_search_location_input_query(inputs)
	return en_webmcp_search_location_input_query(inputs)
});