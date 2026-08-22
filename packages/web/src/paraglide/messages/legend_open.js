/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_OpenInputs */

const en_legend_open = /** @type {(inputs: Legend_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open map legend`)
};

const af_legend_open = /** @type {(inputs: Legend_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maak kaartlegende oop`)
};

/**
* | output |
* | --- |
* | "Open map legend" |
*
* @param {Legend_OpenInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_open = /** @type {((inputs?: Legend_OpenInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_OpenInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_legend_open(inputs)
	return en_legend_open(inputs)
});