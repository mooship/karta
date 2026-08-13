/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ query: NonNullable<unknown> }} Webmcp_Search_Location_Not_FoundInputs */

const en_webmcp_search_location_not_found = /** @type {(inputs: Webmcp_Search_Location_Not_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No location found matching "${i?.query}".`)
};

const st_webmcp_search_location_not_found = /** @type {(inputs: Webmcp_Search_Location_Not_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ha ho sebaka se fumanoeng se tsamaellanang le "${i?.query}".`)
};

const zu_webmcp_search_location_not_found = /** @type {(inputs: Webmcp_Search_Location_Not_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ayikho indawo etholakele ehambisana no-"${i?.query}".`)
};

const xh_webmcp_search_location_not_found = /** @type {(inputs: Webmcp_Search_Location_Not_FoundInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Akukho ndawo ifunyenweyo ehambelana no-"${i?.query}".`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_search_location_not_found = /** @type {((inputs: Webmcp_Search_Location_Not_FoundInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_Not_FoundInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_search_location_not_found(inputs)
	if (locale === "zu") return zu_webmcp_search_location_not_found(inputs)
	if (locale === "xh") return xh_webmcp_search_location_not_found(inputs)
	if (locale === "af") return af_webmcp_search_location_not_found(inputs)
	return en_webmcp_search_location_not_found(inputs)
});