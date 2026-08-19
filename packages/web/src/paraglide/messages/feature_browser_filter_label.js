/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Feature_Browser_Filter_LabelInputs */

const en_feature_browser_filter_label = /** @type {(inputs: Feature_Browser_Filter_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filter features`)
};

const st_feature_browser_filter_label = /** @type {(inputs: Feature_Browser_Filter_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sefa dintho`)
};

const zu_feature_browser_filter_label = /** @type {(inputs: Feature_Browser_Filter_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hlunga izici`)
};

const xh_feature_browser_filter_label = /** @type {(inputs: Feature_Browser_Filter_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hluza iimpawu`)
};

const af_feature_browser_filter_label = /** @type {(inputs: Feature_Browser_Filter_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filtreer kenmerke`)
};

/**
* | output |
* | --- |
* | "Filter features" |
*
* @param {Feature_Browser_Filter_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const feature_browser_filter_label = /** @type {((inputs?: Feature_Browser_Filter_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Feature_Browser_Filter_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_feature_browser_filter_label(inputs)
	if (locale === "zu") return zu_feature_browser_filter_label(inputs)
	if (locale === "xh") return xh_feature_browser_filter_label(inputs)
	if (locale === "af") return af_feature_browser_filter_label(inputs)
	return en_feature_browser_filter_label(inputs)
});