/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Layer_State_VisibleInputs */

const en_webmcp_layer_state_visible = /** @type {(inputs: Webmcp_Layer_State_VisibleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`visible`)
};

const af_webmcp_layer_state_visible = /** @type {(inputs: Webmcp_Layer_State_VisibleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`sigbaar`)
};

/**
* | output |
* | --- |
* | "visible" |
*
* @param {Webmcp_Layer_State_VisibleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_layer_state_visible = /** @type {((inputs?: Webmcp_Layer_State_VisibleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Layer_State_VisibleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_layer_state_visible(inputs)
	return en_webmcp_layer_state_visible(inputs)
});