/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Feature_Browser_Filter_LabelInputs */



/**
* | output |
* | --- |
* | "Filter features" |
*
* @param {Feature_Browser_Filter_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const feature_browser_filter_label = /** @type {((inputs?: Feature_Browser_Filter_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Feature_Browser_Filter_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Filtreer kenmerke")
	return /** @type {LocalizedString} */ ("Filter features")
});