/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Browse_Search_PlaceholderInputs */

const en_browse_search_placeholder = /** @type {(inputs: Browse_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search`)
};

const st_browse_search_placeholder = /** @type {(inputs: Browse_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Batla`)
};

const zu_browse_search_placeholder = /** @type {(inputs: Browse_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sesha`)
};

const xh_browse_search_placeholder = /** @type {(inputs: Browse_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Khangela`)
};

const af_browse_search_placeholder = /** @type {(inputs: Browse_Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Soek`)
};

/**
* | output |
* | --- |
* | "Search" |
*
* @param {Browse_Search_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const browse_search_placeholder = /** @type {((inputs?: Browse_Search_PlaceholderInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Browse_Search_PlaceholderInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_browse_search_placeholder(inputs)
	if (locale === "zu") return zu_browse_search_placeholder(inputs)
	if (locale === "xh") return xh_browse_search_placeholder(inputs)
	if (locale === "af") return af_browse_search_placeholder(inputs)
	return en_browse_search_placeholder(inputs)
});