/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Heritage_Popup_SummaryInputs */

const en_heritage_popup_summary = /** @type {(inputs: Heritage_Popup_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Summary`)
};

const st_heritage_popup_summary = /** @type {(inputs: Heritage_Popup_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kakaretso`)
};

const zu_heritage_popup_summary = /** @type {(inputs: Heritage_Popup_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isifinyezo`)
};

const xh_heritage_popup_summary = /** @type {(inputs: Heritage_Popup_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isishwankathelo`)
};

const af_heritage_popup_summary = /** @type {(inputs: Heritage_Popup_SummaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opsomming`)
};

/**
* | output |
* | --- |
* | "Summary" |
*
* @param {Heritage_Popup_SummaryInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const heritage_popup_summary = /** @type {((inputs?: Heritage_Popup_SummaryInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Heritage_Popup_SummaryInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_heritage_popup_summary(inputs)
	if (locale === "zu") return zu_heritage_popup_summary(inputs)
	if (locale === "xh") return xh_heritage_popup_summary(inputs)
	if (locale === "af") return af_heritage_popup_summary(inputs)
	return en_heritage_popup_summary(inputs)
});