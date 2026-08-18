/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Heritage_Popup_CategoryInputs */

const en_heritage_popup_category = /** @type {(inputs: Heritage_Popup_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Category`)
};

const st_heritage_popup_category = /** @type {(inputs: Heritage_Popup_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sehlopha`)
};

const zu_heritage_popup_category = /** @type {(inputs: Heritage_Popup_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isigaba`)
};

const xh_heritage_popup_category = /** @type {(inputs: Heritage_Popup_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Udidi`)
};

const af_heritage_popup_category = /** @type {(inputs: Heritage_Popup_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kategorie`)
};

/**
* | output |
* | --- |
* | "Category" |
*
* @param {Heritage_Popup_CategoryInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const heritage_popup_category = /** @type {((inputs?: Heritage_Popup_CategoryInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Heritage_Popup_CategoryInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_heritage_popup_category(inputs)
	if (locale === "zu") return zu_heritage_popup_category(inputs)
	if (locale === "xh") return xh_heritage_popup_category(inputs)
	if (locale === "af") return af_heritage_popup_category(inputs)
	return en_heritage_popup_category(inputs)
});