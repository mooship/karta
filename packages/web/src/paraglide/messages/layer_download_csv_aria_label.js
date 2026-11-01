/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Layer_Download_Csv_Aria_LabelInputs */



/**
* | output |
* | --- |
* | "Download {label} data (CSV)" |
*
* @param {Layer_Download_Csv_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_download_csv_aria_label = /** @type {((inputs: Layer_Download_Csv_Aria_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Download_Csv_Aria_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Laai ${i?.label}-data af (CSV)`)
	return /** @type {LocalizedString} */ (`Download ${i?.label} data (CSV)`)
});