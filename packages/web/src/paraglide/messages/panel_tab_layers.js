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

/**
* | output |
* | --- |
* | "Layers" |
*
* @param {Panel_Tab_LayersInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const panel_tab_layers = /** @type {((inputs?: Panel_Tab_LayersInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_LayersInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_tab_layers(inputs)
	if (locale === "zu") return zu_panel_tab_layers(inputs)
	if (locale === "xh") return xh_panel_tab_layers(inputs)
	return en_panel_tab_layers(inputs)
});