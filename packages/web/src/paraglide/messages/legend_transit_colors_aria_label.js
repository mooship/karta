/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_Transit_Colors_Aria_LabelInputs */

const en_legend_transit_colors_aria_label = /** @type {(inputs: Legend_Transit_Colors_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transit route colours`)
};

const af_legend_transit_colors_aria_label = /** @type {(inputs: Legend_Transit_Colors_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vervoerroetekleure`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_legend_transit_colors_aria_label(inputs)
	return en_legend_transit_colors_aria_label(inputs)
});