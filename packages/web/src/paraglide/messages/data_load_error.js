/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Data_Load_ErrorInputs */

const en_data_load_error = /** @type {(inputs: Data_Load_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map data could not be loaded.`)
};

const af_data_load_error = /** @type {(inputs: Data_Load_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kaartdata kon nie gelaai word nie.`)
};

/**
* | output |
* | --- |
* | "Map data could not be loaded." |
*
* @param {Data_Load_ErrorInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const data_load_error = /** @type {((inputs?: Data_Load_ErrorInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Data_Load_ErrorInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_data_load_error(inputs)
	return en_data_load_error(inputs)
});