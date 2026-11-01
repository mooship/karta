/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Feature_Browser_Filter_PlaceholderInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Soek volgens naam")
	return /** @type {LocalizedString} */ ("Search by name")
});