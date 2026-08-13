/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Webmcp_Toggle_Layer_Now_HiddenInputs */

const en_webmcp_toggle_layer_now_hidden = /** @type {(inputs: Webmcp_Toggle_Layer_Now_HiddenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Layer "${i?.label}" is now hidden.`)
};

const st_webmcp_toggle_layer_now_hidden = /** @type {(inputs: Webmcp_Toggle_Layer_Now_HiddenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Karolo "${i?.label}" hona jwale e patiloe.`)
};

const zu_webmcp_toggle_layer_now_hidden = /** @type {(inputs: Webmcp_Toggle_Layer_Now_HiddenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Isendlalelo "${i?.label}" manje sifihliwe.`)
};

const xh_webmcp_toggle_layer_now_hidden = /** @type {(inputs: Webmcp_Toggle_Layer_Now_HiddenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ileya "${i?.label}" ngoku ifihliwe.`)
};

const af_webmcp_toggle_layer_now_hidden = /** @type {(inputs: Webmcp_Toggle_Layer_Now_HiddenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Laag "${i?.label}" is nou versteek.`)
};

/**
* | output |
* | --- |
* | "Layer \"{label}\" is now hidden." |
*
* @param {Webmcp_Toggle_Layer_Now_HiddenInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_now_hidden = /** @type {((inputs: Webmcp_Toggle_Layer_Now_HiddenInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_Now_HiddenInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_toggle_layer_now_hidden(inputs)
	if (locale === "zu") return zu_webmcp_toggle_layer_now_hidden(inputs)
	if (locale === "xh") return xh_webmcp_toggle_layer_now_hidden(inputs)
	if (locale === "af") return af_webmcp_toggle_layer_now_hidden(inputs)
	return en_webmcp_toggle_layer_now_hidden(inputs)
});