/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Layer_Download_Aria_LabelInputs */

const en_layer_download_aria_label = /** @type {(inputs: Layer_Download_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Download ${i?.label} data (GeoJSON)`)
};

/**
* | output |
* | --- |
* | "Download {label} data (GeoJSON)" |
*
* @param {Layer_Download_Aria_LabelInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const layer_download_aria_label = /** @type {((inputs: Layer_Download_Aria_LabelInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Download_Aria_LabelInputs, { locale?: "en" }, {}>} */ ((inputs, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_layer_download_aria_label(inputs)
});