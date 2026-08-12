/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tab_LayersInputs */

const en_panel_tab_layers = /** @type {(inputs: Panel_Tab_LayersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Layers`)
};

const st_panel_tab_layers = /** @type {(inputs: Panel_Tab_LayersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mera`)
};

const zu_panel_tab_layers = /** @type {(inputs: Panel_Tab_LayersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Izingqimba`)
};

const xh_panel_tab_layers = /** @type {(inputs: Panel_Tab_LayersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iingqimba`)
};

const af_panel_tab_layers = /** @type {(inputs: Panel_Tab_LayersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lae`)
};

/**
* | output |
* | --- |
* | "Layers" |
*
* @param {Panel_Tab_LayersInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_tab_layers = /** @type {((inputs?: Panel_Tab_LayersInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_LayersInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_tab_layers(inputs)
	if (locale === "zu") return zu_panel_tab_layers(inputs)
	if (locale === "xh") return xh_panel_tab_layers(inputs)
	if (locale === "af") return af_panel_tab_layers(inputs)
	return en_panel_tab_layers(inputs)
});