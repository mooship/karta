/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_DistanceInputs */

const en_township_popup_distance = /** @type {(inputs: Township_Popup_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Distance`)
};

const st_township_popup_distance = /** @type {(inputs: Township_Popup_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bohole`)
};

const zu_township_popup_distance = /** @type {(inputs: Township_Popup_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibanga`)
};

/**
* | output |
* | --- |
* | "Distance" |
*
* @param {Township_Popup_DistanceInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const township_popup_distance = /** @type {((inputs?: Township_Popup_DistanceInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_DistanceInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_township_popup_distance(inputs)
	if (locale === "zu") return zu_township_popup_distance(inputs)
	return en_township_popup_distance(inputs)
});