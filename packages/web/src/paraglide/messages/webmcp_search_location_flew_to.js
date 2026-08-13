/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ location: NonNullable<unknown> }} Webmcp_Search_Location_Flew_ToInputs */

const en_webmcp_search_location_flew_to = /** @type {(inputs: Webmcp_Search_Location_Flew_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Flew to ${i?.location}.`)
};

const st_webmcp_search_location_flew_to = /** @type {(inputs: Webmcp_Search_Location_Flew_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ho ilwe ${i?.location}.`)
};

const zu_webmcp_search_location_flew_to = /** @type {(inputs: Webmcp_Search_Location_Flew_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Kuyiwe e-${i?.location}.`)
};

const xh_webmcp_search_location_flew_to = /** @type {(inputs: Webmcp_Search_Location_Flew_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Kuyiwe e-${i?.location}.`)
};

const af_webmcp_search_location_flew_to = /** @type {(inputs: Webmcp_Search_Location_Flew_ToInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Na ${i?.location} beweeg.`)
};

/**
* | output |
* | --- |
* | "Flew to {location}." |
*
* @param {Webmcp_Search_Location_Flew_ToInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_search_location_flew_to = /** @type {((inputs: Webmcp_Search_Location_Flew_ToInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Search_Location_Flew_ToInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_search_location_flew_to(inputs)
	if (locale === "zu") return zu_webmcp_search_location_flew_to(inputs)
	if (locale === "xh") return xh_webmcp_search_location_flew_to(inputs)
	if (locale === "af") return af_webmcp_search_location_flew_to(inputs)
	return en_webmcp_search_location_flew_to(inputs)
});