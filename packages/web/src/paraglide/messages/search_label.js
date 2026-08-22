/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Search_LabelInputs */

const en_search_label = /** @type {(inputs: Search_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search place`)
};

const af_search_label = /** @type {(inputs: Search_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Soek plek`)
};

/**
* | output |
* | --- |
* | "Search place" |
*
* @param {Search_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const search_label = /** @type {((inputs?: Search_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_search_label(inputs)
	return en_search_label(inputs)
});