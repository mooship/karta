/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tab_BrowseInputs */

const en_panel_tab_browse = /** @type {(inputs: Panel_Tab_BrowseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Browse`)
};

const af_panel_tab_browse = /** @type {(inputs: Panel_Tab_BrowseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Blaai`)
};

/**
* | output |
* | --- |
* | "Browse" |
*
* @param {Panel_Tab_BrowseInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_tab_browse = /** @type {((inputs?: Panel_Tab_BrowseInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_BrowseInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_panel_tab_browse(inputs)
	return en_panel_tab_browse(inputs)
});