/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tab_LayersInputs */

const en_panel_tab_layers = /** @type {(inputs: Panel_Tab_LayersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Layers`)
};

/**
* | output |
* | --- |
* | "Layers" |
*
* @param {Panel_Tab_LayersInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const panel_tab_layers = /** @type {((inputs?: Panel_Tab_LayersInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_LayersInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_panel_tab_layers(inputs)
});