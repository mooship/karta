/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Failed_BadgeInputs */



/**
* | output |
* | --- |
* | "Failed to load — toggle off and on to retry" |
*
* @param {Layer_Failed_BadgeInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_failed_badge = /** @type {((inputs?: Layer_Failed_BadgeInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Failed_BadgeInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Kon nie laai nie — skakel af en aan om weer te probeer")
	return /** @type {LocalizedString} */ ("Failed to load — toggle off and on to retry")
});