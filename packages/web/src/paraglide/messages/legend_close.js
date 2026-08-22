/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_CloseInputs */

const en_legend_close = /** @type {(inputs: Legend_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close map legend`)
};

const af_legend_close = /** @type {(inputs: Legend_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maak kaartlegende toe`)
};

/**
* | output |
* | --- |
* | "Close map legend" |
*
* @param {Legend_CloseInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_close = /** @type {((inputs?: Legend_CloseInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_CloseInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_legend_close(inputs)
	return en_legend_close(inputs)
});