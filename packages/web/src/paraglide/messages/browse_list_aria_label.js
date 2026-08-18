/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ layer: NonNullable<unknown> }} Browse_List_Aria_LabelInputs */

const en_browse_list_aria_label = /** @type {(inputs: Browse_List_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Browse ${i?.layer}`)
};

const st_browse_list_aria_label = /** @type {(inputs: Browse_List_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sheba ${i?.layer}`)
};

const zu_browse_list_aria_label = /** @type {(inputs: Browse_List_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Bheka ${i?.layer}`)
};

const xh_browse_list_aria_label = /** @type {(inputs: Browse_List_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Jonga ${i?.layer}`)
};

const af_browse_list_aria_label = /** @type {(inputs: Browse_List_Aria_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Blaai deur ${i?.layer}`)
};

/**
* | output |
* | --- |
* | "Browse {layer}" |
*
* @param {Browse_List_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const browse_list_aria_label = /** @type {((inputs: Browse_List_Aria_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Browse_List_Aria_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_browse_list_aria_label(inputs)
	if (locale === "zu") return zu_browse_list_aria_label(inputs)
	if (locale === "xh") return xh_browse_list_aria_label(inputs)
	if (locale === "af") return af_browse_list_aria_label(inputs)
	return en_browse_list_aria_label(inputs)
});