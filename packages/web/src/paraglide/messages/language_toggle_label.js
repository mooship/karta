/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Language_Toggle_LabelInputs */

const en_language_toggle_label = /** @type {(inputs: Language_Toggle_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language`)
};

const st_language_toggle_label = /** @type {(inputs: Language_Toggle_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Puo`)
};

const zu_language_toggle_label = /** @type {(inputs: Language_Toggle_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ulimi`)
};

const xh_language_toggle_label = /** @type {(inputs: Language_Toggle_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ulwimi`)
};

/**
* | output |
* | --- |
* | "Language" |
*
* @param {Language_Toggle_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const language_toggle_label = /** @type {((inputs?: Language_Toggle_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Language_Toggle_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_language_toggle_label(inputs)
	if (locale === "zu") return zu_language_toggle_label(inputs)
	if (locale === "xh") return xh_language_toggle_label(inputs)
	return en_language_toggle_label(inputs)
});