/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Unavailable_BadgeInputs */



/**
* | output |
* | --- |
* | "Not yet available" |
*
* @param {Layer_Unavailable_BadgeInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_unavailable_badge = /** @type {((inputs?: Layer_Unavailable_BadgeInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Unavailable_BadgeInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Nog nie beskikbaar nie")
	return /** @type {LocalizedString} */ ("Not yet available")
});