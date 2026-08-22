/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Webmcp_Toggle_Layer_Now_VisibleInputs */

const en_webmcp_toggle_layer_now_visible = /** @type {(inputs: Webmcp_Toggle_Layer_Now_VisibleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Layer "${i?.label}" is now visible.`)
};

const af_webmcp_toggle_layer_now_visible = /** @type {(inputs: Webmcp_Toggle_Layer_Now_VisibleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Laag "${i?.label}" is nou sigbaar.`)
};

/**
* | output |
* | --- |
* | "Layer \"{label}\" is now visible." |
*
* @param {Webmcp_Toggle_Layer_Now_VisibleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_now_visible = /** @type {((inputs: Webmcp_Toggle_Layer_Now_VisibleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_Now_VisibleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_toggle_layer_now_visible(inputs)
	return en_webmcp_toggle_layer_now_visible(inputs)
});