/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tablist_Aria_LabelInputs */

const en_panel_tablist_aria_label = /** @type {(inputs: Panel_Tablist_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map panel`)
};

/**
* | output |
* | --- |
* | "Map panel" |
*
* @param {Panel_Tablist_Aria_LabelInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const panel_tablist_aria_label = /** @type {((inputs?: Panel_Tablist_Aria_LabelInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tablist_Aria_LabelInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_panel_tablist_aria_label(inputs)
});