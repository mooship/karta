/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Unavailable_BadgeInputs */

const en_layer_unavailable_badge = /** @type {(inputs: Layer_Unavailable_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not yet available`)
};

const st_layer_unavailable_badge = /** @type {(inputs: Layer_Unavailable_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ha e so fumaneha`)
};

const zu_layer_unavailable_badge = /** @type {(inputs: Layer_Unavailable_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ayikatholakali`)
};

const xh_layer_unavailable_badge = /** @type {(inputs: Layer_Unavailable_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ayikafumaneki`)
};

const af_layer_unavailable_badge = /** @type {(inputs: Layer_Unavailable_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nog nie beskikbaar nie`)
};

/**
* | output |
* | --- |
* | "Not yet available" |
*
* @param {Layer_Unavailable_BadgeInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_unavailable_badge = /** @type {((inputs?: Layer_Unavailable_BadgeInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Unavailable_BadgeInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_unavailable_badge(inputs)
	if (locale === "zu") return zu_layer_unavailable_badge(inputs)
	if (locale === "xh") return xh_layer_unavailable_badge(inputs)
	if (locale === "af") return af_layer_unavailable_badge(inputs)
	return en_layer_unavailable_badge(inputs)
});