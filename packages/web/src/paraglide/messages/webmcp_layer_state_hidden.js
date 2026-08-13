/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Layer_State_HiddenInputs */

const en_webmcp_layer_state_hidden = /** @type {(inputs: Webmcp_Layer_State_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`hidden`)
};

const st_webmcp_layer_state_hidden = /** @type {(inputs: Webmcp_Layer_State_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e patiloe`)
};

const zu_webmcp_layer_state_hidden = /** @type {(inputs: Webmcp_Layer_State_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ifihliwe`)
};

const xh_webmcp_layer_state_hidden = /** @type {(inputs: Webmcp_Layer_State_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ifihliwe`)
};

const af_webmcp_layer_state_hidden = /** @type {(inputs: Webmcp_Layer_State_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`versteek`)
};

/**
* | output |
* | --- |
* | "hidden" |
*
* @param {Webmcp_Layer_State_HiddenInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_layer_state_hidden = /** @type {((inputs?: Webmcp_Layer_State_HiddenInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Layer_State_HiddenInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_layer_state_hidden(inputs)
	if (locale === "zu") return zu_webmcp_layer_state_hidden(inputs)
	if (locale === "xh") return xh_webmcp_layer_state_hidden(inputs)
	if (locale === "af") return af_webmcp_layer_state_hidden(inputs)
	return en_webmcp_layer_state_hidden(inputs)
});