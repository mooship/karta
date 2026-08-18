/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tab_BrowseInputs */

const en_panel_tab_browse = /** @type {(inputs: Panel_Tab_BrowseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Browse`)
};

const st_panel_tab_browse = /** @type {(inputs: Panel_Tab_BrowseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sheba`)
};

const zu_panel_tab_browse = /** @type {(inputs: Panel_Tab_BrowseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bheka`)
};

const xh_panel_tab_browse = /** @type {(inputs: Panel_Tab_BrowseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jonga`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_tab_browse = /** @type {((inputs?: Panel_Tab_BrowseInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_BrowseInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_tab_browse(inputs)
	if (locale === "zu") return zu_panel_tab_browse(inputs)
	if (locale === "xh") return xh_panel_tab_browse(inputs)
	if (locale === "af") return af_panel_tab_browse(inputs)
	return en_panel_tab_browse(inputs)
});