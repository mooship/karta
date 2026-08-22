/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Search_SearchingInputs */

const en_search_searching = /** @type {(inputs: Search_SearchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Searching places...`)
};

const af_search_searching = /** @type {(inputs: Search_SearchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deursoek plekke...`)
};

/**
* | output |
* | --- |
* | "Searching places..." |
*
* @param {Search_SearchingInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const search_searching = /** @type {((inputs?: Search_SearchingInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_SearchingInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_search_searching(inputs)
	return en_search_searching(inputs)
});