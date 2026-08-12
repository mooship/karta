/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Failed_BadgeInputs */

const en_layer_failed_badge = /** @type {(inputs: Layer_Failed_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Failed to load — toggle off and on to retry`)
};

const st_layer_failed_badge = /** @type {(inputs: Layer_Failed_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E hlotswe ho kenngwa — e time, o be o e bule hape ho leka hape`)
};

const zu_layer_failed_badge = /** @type {(inputs: Layer_Failed_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yehlulekile ukulayisha — vala uphinde uvule ukuze uzame futhi`)
};

const xh_layer_failed_badge = /** @type {(inputs: Layer_Failed_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yehlulekile ukulayisha — vala uphinde uvule ukuze uzame kwakhona`)
};

/**
* | output |
* | --- |
* | "Failed to load — toggle off and on to retry" |
*
* @param {Layer_Failed_BadgeInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const layer_failed_badge = /** @type {((inputs?: Layer_Failed_BadgeInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Failed_BadgeInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_failed_badge(inputs)
	if (locale === "zu") return zu_layer_failed_badge(inputs)
	if (locale === "xh") return xh_layer_failed_badge(inputs)
	return en_layer_failed_badge(inputs)
});