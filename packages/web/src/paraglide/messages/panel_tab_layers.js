/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tab_LayersInputs */

const en_panel_tab_layers = /** @type {(inputs: Panel_Tab_LayersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Layers`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_tab_layers = /** @type {((inputs?: Panel_Tab_LayersInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_LayersInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_panel_tab_layers(inputs)
	return en_panel_tab_layers(inputs)
});