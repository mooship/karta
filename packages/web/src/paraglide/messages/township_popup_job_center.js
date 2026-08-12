/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_Job_CenterInputs */

const en_township_popup_job_center = /** @type {(inputs: Township_Popup_Job_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nearest job centre`)
};

const st_township_popup_job_center = /** @type {(inputs: Township_Popup_Job_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Setsi sa mesebetsi se haufi`)
};

const zu_township_popup_job_center = /** @type {(inputs: Township_Popup_Job_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isikhungo somsebenzi esiseduze`)
};

/**
* | output |
* | --- |
* | "Nearest job centre" |
*
* @param {Township_Popup_Job_CenterInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const township_popup_job_center = /** @type {((inputs?: Township_Popup_Job_CenterInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_Job_CenterInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_township_popup_job_center(inputs)
	if (locale === "zu") return zu_township_popup_job_center(inputs)
	return en_township_popup_job_center(inputs)
});