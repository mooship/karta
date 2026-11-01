/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_Job_CenterInputs */



/**
* | output |
* | --- |
* | "Nearest job centre" |
*
* @param {Township_Popup_Job_CenterInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const township_popup_job_center = /** @type {((inputs?: Township_Popup_Job_CenterInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_Job_CenterInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Naaste werksentrum")
	return /** @type {LocalizedString} */ ("Nearest job centre")
});