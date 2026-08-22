/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Webmcp_Toggle_Layer_Now_HiddenInputs */

const en_webmcp_toggle_layer_now_hidden = /** @type {(inputs: Webmcp_Toggle_Layer_Now_HiddenInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Layer "${i?.label}" is now hidden.`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_now_hidden = /** @type {((inputs: Webmcp_Toggle_Layer_Now_HiddenInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_Now_HiddenInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_toggle_layer_now_hidden(inputs)
	return en_webmcp_toggle_layer_now_hidden(inputs)
});