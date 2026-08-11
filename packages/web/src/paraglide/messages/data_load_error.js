/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Data_Load_ErrorInputs */

const en_data_load_error = /** @type {(inputs: Data_Load_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map data could not be loaded.`)
};

/**
* | output |
* | --- |
* | "Map data could not be loaded." |
*
* @param {Data_Load_ErrorInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const data_load_error = /** @type {((inputs?: Data_Load_ErrorInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Data_Load_ErrorInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_data_load_error(inputs)
});