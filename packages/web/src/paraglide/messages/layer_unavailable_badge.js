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

/**
* | output |
* | --- |
* | "Not yet available" |
*
* @param {Layer_Unavailable_BadgeInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const layer_unavailable_badge = /** @type {((inputs?: Layer_Unavailable_BadgeInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Unavailable_BadgeInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_unavailable_badge(inputs)
	if (locale === "zu") return zu_layer_unavailable_badge(inputs)
	return en_layer_unavailable_badge(inputs)
});