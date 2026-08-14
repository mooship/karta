/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Csv_Export_ErrorInputs */

const en_layer_csv_export_error = /** @type {(inputs: Layer_Csv_Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Couldn't prepare the CSV file. Try again.`)
};

const st_layer_csv_export_error = /** @type {(inputs: Layer_Csv_Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faele ya CSV e hlotswe ho lokiswa. Leka hape.`)
};

const zu_layer_csv_export_error = /** @type {(inputs: Layer_Csv_Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ayikwazanga ukulungisa ifayela le-CSV. Zama futhi.`)
};

const xh_layer_csv_export_error = /** @type {(inputs: Layer_Csv_Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ayikwazanga ukulungisa ifayile ye-CSV. Zama kwakhona.`)
};

const af_layer_csv_export_error = /** @type {(inputs: Layer_Csv_Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kon nie die CSV-lêer voorberei nie. Probeer weer.`)
};

/**
* | output |
* | --- |
* | "Couldn't prepare the CSV file. Try again." |
*
* @param {Layer_Csv_Export_ErrorInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_csv_export_error = /** @type {((inputs?: Layer_Csv_Export_ErrorInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Csv_Export_ErrorInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_csv_export_error(inputs)
	if (locale === "zu") return zu_layer_csv_export_error(inputs)
	if (locale === "xh") return xh_layer_csv_export_error(inputs)
	if (locale === "af") return af_layer_csv_export_error(inputs)
	return en_layer_csv_export_error(inputs)
});