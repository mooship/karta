/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Search_No_ResultsInputs */

const en_search_no_results = /** @type {(inputs: Search_No_ResultsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing matched that search.`)
};

const af_search_no_results = /** @type {(inputs: Search_No_ResultsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Niks het by daardie soektog gepas nie.`)
};

/**
* | output |
* | --- |
* | "Nothing matched that search." |
*
* @param {Search_No_ResultsInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const search_no_results = /** @type {((inputs?: Search_No_ResultsInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_No_ResultsInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_search_no_results(inputs)
	return en_search_no_results(inputs)
});