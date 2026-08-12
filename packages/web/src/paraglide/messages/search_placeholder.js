/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Search_PlaceholderInputs */

const en_search_placeholder = /** @type {(inputs: Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search town, suburb or station`)
};

const st_search_placeholder = /** @type {(inputs: Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Batla toropo, sebaka kapa seteishene`)
};

const zu_search_placeholder = /** @type {(inputs: Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sesha idolobha, indawo noma isiteshi`)
};

const xh_search_placeholder = /** @type {(inputs: Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Khangela idolophu, indawo okanye isikhululo`)
};

const af_search_placeholder = /** @type {(inputs: Search_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Soek dorp, voorstad of stasie`)
};

/**
* | output |
* | --- |
* | "Search town, suburb or station" |
*
* @param {Search_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const search_placeholder = /** @type {((inputs?: Search_PlaceholderInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_PlaceholderInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_search_placeholder(inputs)
	if (locale === "zu") return zu_search_placeholder(inputs)
	if (locale === "xh") return xh_search_placeholder(inputs)
	if (locale === "af") return af_search_placeholder(inputs)
	return en_search_placeholder(inputs)
});