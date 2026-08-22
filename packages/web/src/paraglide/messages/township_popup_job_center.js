/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_Job_CenterInputs */

const en_township_popup_job_center = /** @type {(inputs: Township_Popup_Job_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nearest job centre`)
};

const af_township_popup_job_center = /** @type {(inputs: Township_Popup_Job_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Naaste werksentrum`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_township_popup_job_center(inputs)
	return en_township_popup_job_center(inputs)
});