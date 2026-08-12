/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tablist_Aria_LabelInputs */

const en_panel_tablist_aria_label = /** @type {(inputs: Panel_Tablist_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map panel`)
};

const st_panel_tablist_aria_label = /** @type {(inputs: Panel_Tablist_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Panele ya 'mapa`)
};

const zu_panel_tablist_aria_label = /** @type {(inputs: Panel_Tablist_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iphaneli yebalazwe`)
};

const xh_panel_tablist_aria_label = /** @type {(inputs: Panel_Tablist_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iphaneli yemephu`)
};

/**
* | output |
* | --- |
* | "Map panel" |
*
* @param {Panel_Tablist_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const panel_tablist_aria_label = /** @type {((inputs?: Panel_Tablist_Aria_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tablist_Aria_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_tablist_aria_label(inputs)
	if (locale === "zu") return zu_panel_tablist_aria_label(inputs)
	if (locale === "xh") return xh_panel_tablist_aria_label(inputs)
	return en_panel_tablist_aria_label(inputs)
});