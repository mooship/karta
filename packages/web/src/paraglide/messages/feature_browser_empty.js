/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Feature_Browser_EmptyInputs */

const en_feature_browser_empty = /** @type {(inputs: Feature_Browser_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing matched that search.`)
};

const st_feature_browser_empty = /** @type {(inputs: Feature_Browser_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ha ho letho le fumanweng phuputsong ena.`)
};

const zu_feature_browser_empty = /** @type {(inputs: Feature_Browser_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Akukho okutholakele kuleso sesho.`)
};

const xh_feature_browser_empty = /** @type {(inputs: Feature_Browser_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Akukho nto ifunyenweyo kuloo khangelo.`)
};

const af_feature_browser_empty = /** @type {(inputs: Feature_Browser_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Niks het by daardie soektog gepas nie.`)
};

/**
* | output |
* | --- |
* | "Nothing matched that search." |
*
* @param {Feature_Browser_EmptyInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const feature_browser_empty = /** @type {((inputs?: Feature_Browser_EmptyInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Feature_Browser_EmptyInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_feature_browser_empty(inputs)
	if (locale === "zu") return zu_feature_browser_empty(inputs)
	if (locale === "xh") return xh_feature_browser_empty(inputs)
	if (locale === "af") return af_feature_browser_empty(inputs)
	return en_feature_browser_empty(inputs)
});