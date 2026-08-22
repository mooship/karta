/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_TitleInputs */

const en_legend_title = /** @type {(inputs: Legend_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map legend`)
};

const af_legend_title = /** @type {(inputs: Legend_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kaartlegende`)
};

/**
* | output |
* | --- |
* | "Map legend" |
*
* @param {Legend_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_title = /** @type {((inputs?: Legend_TitleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_TitleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_legend_title(inputs)
	return en_legend_title(inputs)
});