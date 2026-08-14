/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Layer_Download_Csv_Aria_LabelInputs */

const en_layer_download_csv_aria_label = /** @type {(inputs: Layer_Download_Csv_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Download ${i?.label} data (CSV)`)
};

const st_layer_download_csv_aria_label = /** @type {(inputs: Layer_Download_Csv_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Daonlouda boitsebiso ba ${i?.label} (CSV)`)
};

const zu_layer_download_csv_aria_label = /** @type {(inputs: Layer_Download_Csv_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Landa idatha ye-${i?.label} (CSV)`)
};

const xh_layer_download_csv_aria_label = /** @type {(inputs: Layer_Download_Csv_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Khuphela idatha ye-${i?.label} (CSV)`)
};

const af_layer_download_csv_aria_label = /** @type {(inputs: Layer_Download_Csv_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Laai ${i?.label}-data af (CSV)`)
};

/**
* | output |
* | --- |
* | "Download {label} data (CSV)" |
*
* @param {Layer_Download_Csv_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_download_csv_aria_label = /** @type {((inputs: Layer_Download_Csv_Aria_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Download_Csv_Aria_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_download_csv_aria_label(inputs)
	if (locale === "zu") return zu_layer_download_csv_aria_label(inputs)
	if (locale === "xh") return xh_layer_download_csv_aria_label(inputs)
	if (locale === "af") return af_layer_download_csv_aria_label(inputs)
	return en_layer_download_csv_aria_label(inputs)
});