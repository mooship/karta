/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Commuter_Rail_LabelInputs */



/**
* | output |
* | --- |
* | "Commuter Rail" |
*
* @param {Layer_Commuter_Rail_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_commuter_rail_label = /** @type {((inputs?: Layer_Commuter_Rail_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Commuter_Rail_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Pendelspoor")
	return /** @type {LocalizedString} */ ("Commuter Rail")
});