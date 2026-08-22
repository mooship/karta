/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Layer_Download_Aria_LabelInputs */

const en_layer_download_aria_label = /** @type {(inputs: Layer_Download_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Download ${i?.label} data (GeoJSON)`)
};

const af_layer_download_aria_label = /** @type {(inputs: Layer_Download_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Laai ${i?.label}-data af (GeoJSON)`)
};

/**
* | output |
* | --- |
* | "Download {label} data (GeoJSON)" |
*
* @param {Layer_Download_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_download_aria_label = /** @type {((inputs: Layer_Download_Aria_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Download_Aria_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_download_aria_label(inputs)
	return en_layer_download_aria_label(inputs)
});