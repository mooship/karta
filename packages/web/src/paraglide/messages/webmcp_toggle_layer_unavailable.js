/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Webmcp_Toggle_Layer_UnavailableInputs */



/**
* | output |
* | --- |
* | "Layer \"{label}\" isn't available yet." |
*
* @param {Webmcp_Toggle_Layer_UnavailableInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_unavailable = /** @type {((inputs: Webmcp_Toggle_Layer_UnavailableInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_UnavailableInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Laag "${i?.label}" is nog nie beskikbaar nie.`)
	return /** @type {LocalizedString} */ (`Layer "${i?.label}" isn't available yet.`)
});