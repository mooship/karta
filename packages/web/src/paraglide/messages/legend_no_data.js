/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_No_DataInputs */

const en_legend_no_data = /** @type {(inputs: Legend_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No data`)
};

const af_legend_no_data = /** @type {(inputs: Legend_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geen data`)
};

/**
* | output |
* | --- |
* | "No data" |
*
* @param {Legend_No_DataInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_no_data = /** @type {((inputs?: Legend_No_DataInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_No_DataInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_legend_no_data(inputs)
	return en_legend_no_data(inputs)
});