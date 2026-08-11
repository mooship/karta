/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Toggle_CloseInputs */

const en_panel_toggle_close = /** @type {(inputs: Panel_Toggle_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close`)
};

/**
* | output |
* | --- |
* | "Close" |
*
* @param {Panel_Toggle_CloseInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const panel_toggle_close = /** @type {((inputs?: Panel_Toggle_CloseInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Toggle_CloseInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_panel_toggle_close(inputs)
});