/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Csv_Export_ErrorInputs */

const en_layer_csv_export_error = /** @type {(inputs: Layer_Csv_Export_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Couldn't prepare the CSV file. Try again.`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_csv_export_error = /** @type {((inputs?: Layer_Csv_Export_ErrorInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Csv_Export_ErrorInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_csv_export_error(inputs)
	return en_layer_csv_export_error(inputs)
});