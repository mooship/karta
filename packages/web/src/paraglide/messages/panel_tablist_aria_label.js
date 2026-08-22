/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tablist_Aria_LabelInputs */

const en_panel_tablist_aria_label = /** @type {(inputs: Panel_Tablist_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map panel`)
};

const af_panel_tablist_aria_label = /** @type {(inputs: Panel_Tablist_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kaartpaneel`)
};

/**
* | output |
* | --- |
* | "Map panel" |
*
* @param {Panel_Tablist_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_tablist_aria_label = /** @type {((inputs?: Panel_Tablist_Aria_LabelInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tablist_Aria_LabelInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_panel_tablist_aria_label(inputs)
	return en_panel_tablist_aria_label(inputs)
});