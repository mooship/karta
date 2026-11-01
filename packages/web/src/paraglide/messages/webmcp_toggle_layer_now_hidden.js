/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Webmcp_Toggle_Layer_Now_HiddenInputs */



/**
* | output |
* | --- |
* | "Layer \"{label}\" is now hidden." |
*
* @param {Webmcp_Toggle_Layer_Now_HiddenInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_now_hidden = /** @type {((inputs: Webmcp_Toggle_Layer_Now_HiddenInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_Now_HiddenInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Laag "${i?.label}" is nou versteek.`)
	return /** @type {LocalizedString} */ (`Layer "${i?.label}" is now hidden.`)
});