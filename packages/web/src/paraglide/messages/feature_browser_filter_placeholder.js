/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Feature_Browser_Filter_PlaceholderInputs */

const en_feature_browser_filter_placeholder = /** @type {(inputs: Feature_Browser_Filter_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search by name`)
};

const af_feature_browser_filter_placeholder = /** @type {(inputs: Feature_Browser_Filter_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Soek volgens naam`)
};

/**
* | output |
* | --- |
* | "Search by name" |
*
* @param {Feature_Browser_Filter_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const feature_browser_filter_placeholder = /** @type {((inputs?: Feature_Browser_Filter_PlaceholderInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Feature_Browser_Filter_PlaceholderInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_feature_browser_filter_placeholder(inputs)
	return en_feature_browser_filter_placeholder(inputs)
});