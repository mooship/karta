/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_EmptyInputs */

const en_legend_empty = /** @type {(inputs: Legend_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Turn on layers to view their legend.`)
};

const af_legend_empty = /** @type {(inputs: Legend_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skakel lae aan om die legende te sien.`)
};

/**
* | output |
* | --- |
* | "Turn on layers to view their legend." |
*
* @param {Legend_EmptyInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_empty = /** @type {((inputs?: Legend_EmptyInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_EmptyInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_legend_empty(inputs)
	return en_legend_empty(inputs)
});