/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Toggle_ExploreInputs */

const en_panel_toggle_explore = /** @type {(inputs: Panel_Toggle_ExploreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Explore`)
};

const af_panel_toggle_explore = /** @type {(inputs: Panel_Toggle_ExploreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verken`)
};

/**
* | output |
* | --- |
* | "Explore" |
*
* @param {Panel_Toggle_ExploreInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_toggle_explore = /** @type {((inputs?: Panel_Toggle_ExploreInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Toggle_ExploreInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_panel_toggle_explore(inputs)
	return en_panel_toggle_explore(inputs)
});