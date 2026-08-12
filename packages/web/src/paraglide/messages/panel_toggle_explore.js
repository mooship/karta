/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Toggle_ExploreInputs */

const en_panel_toggle_explore = /** @type {(inputs: Panel_Toggle_ExploreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Explore`)
};

const st_panel_toggle_explore = /** @type {(inputs: Panel_Toggle_ExploreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hlahloba`)
};

const zu_panel_toggle_explore = /** @type {(inputs: Panel_Toggle_ExploreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hlola`)
};

const xh_panel_toggle_explore = /** @type {(inputs: Panel_Toggle_ExploreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hlola`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_toggle_explore = /** @type {((inputs?: Panel_Toggle_ExploreInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Toggle_ExploreInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_toggle_explore(inputs)
	if (locale === "zu") return zu_panel_toggle_explore(inputs)
	if (locale === "xh") return xh_panel_toggle_explore(inputs)
	if (locale === "af") return af_panel_toggle_explore(inputs)
	return en_panel_toggle_explore(inputs)
});