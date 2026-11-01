/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Layer_State_HiddenInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("versteek")
	return /** @type {LocalizedString} */ ("hidden")
});