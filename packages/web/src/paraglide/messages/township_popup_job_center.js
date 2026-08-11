/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_Job_CenterInputs */

const en_township_popup_job_center = /** @type {(inputs: Township_Popup_Job_CenterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nearest job centre`)
};

/**
* | output |
* | --- |
* | "Nearest job centre" |
*
* @param {Township_Popup_Job_CenterInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const township_popup_job_center = /** @type {((inputs?: Township_Popup_Job_CenterInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_Job_CenterInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_township_popup_job_center(inputs)
});