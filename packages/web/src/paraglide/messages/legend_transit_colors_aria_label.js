/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_Transit_Colors_Aria_LabelInputs */



/**
* | output |
* | --- |
* | "Transit route colours" |
*
* @param {Legend_Transit_Colors_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_transit_colors_aria_label = /** @type {((inputs?: Legend_Transit_Colors_Aria_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Transit_Colors_Aria_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Vervoerroetekleure")
	return /** @type {LocalizedString} */ ("Transit route colours")
});