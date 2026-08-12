/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Toggle_CloseInputs */

const en_panel_toggle_close = /** @type {(inputs: Panel_Toggle_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Close`)
};

const st_panel_toggle_close = /** @type {(inputs: Panel_Toggle_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kwala`)
};

const zu_panel_toggle_close = /** @type {(inputs: Panel_Toggle_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vala`)
};

const xh_panel_toggle_close = /** @type {(inputs: Panel_Toggle_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vala`)
};

const af_panel_toggle_close = /** @type {(inputs: Panel_Toggle_CloseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sluit`)
};

/**
* | output |
* | --- |
* | "Close" |
*
* @param {Panel_Toggle_CloseInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_toggle_close = /** @type {((inputs?: Panel_Toggle_CloseInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Toggle_CloseInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_toggle_close(inputs)
	if (locale === "zu") return zu_panel_toggle_close(inputs)
	if (locale === "xh") return xh_panel_toggle_close(inputs)
	if (locale === "af") return af_panel_toggle_close(inputs)
	return en_panel_toggle_close(inputs)
});