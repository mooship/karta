/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Layer_State_HiddenInputs */

const en_webmcp_layer_state_hidden = /** @type {(inputs: Webmcp_Layer_State_HiddenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`hidden`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_layer_state_hidden = /** @type {((inputs?: Webmcp_Layer_State_HiddenInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Layer_State_HiddenInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_layer_state_hidden(inputs)
	return en_webmcp_layer_state_hidden(inputs)
});