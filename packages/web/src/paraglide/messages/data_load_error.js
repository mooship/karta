/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Data_Load_ErrorInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Kaartdata kon nie gelaai word nie.")
	return /** @type {LocalizedString} */ ("Map data could not be loaded.")
});