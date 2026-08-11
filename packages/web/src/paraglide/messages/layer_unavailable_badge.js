/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Unavailable_BadgeInputs */

const en_layer_unavailable_badge = /** @type {(inputs: Layer_Unavailable_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not yet available`)
};

/**
* | output |
* | --- |
* | "Not yet available" |
*
* @param {Layer_Unavailable_BadgeInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const layer_unavailable_badge = /** @type {((inputs?: Layer_Unavailable_BadgeInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Unavailable_BadgeInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_layer_unavailable_badge(inputs)
});