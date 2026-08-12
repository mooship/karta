/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Data_Load_ErrorInputs */

const en_data_load_error = /** @type {(inputs: Data_Load_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map data could not be loaded.`)
};

const st_data_load_error = /** @type {(inputs: Data_Load_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Boitsebiso ba 'mapa bo hlotswe ho kenngwa.`)
};

const zu_data_load_error = /** @type {(inputs: Data_Load_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idatha yebalazwe ayikwazanga ukulayishwa.`)
};

const xh_data_load_error = /** @type {(inputs: Data_Load_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idatha yemephu ayikwazanga ukulayishwa.`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const data_load_error = /** @type {((inputs?: Data_Load_ErrorInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Data_Load_ErrorInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_data_load_error(inputs)
	if (locale === "zu") return zu_data_load_error(inputs)
	if (locale === "xh") return xh_data_load_error(inputs)
	if (locale === "af") return af_data_load_error(inputs)
	return en_data_load_error(inputs)
});