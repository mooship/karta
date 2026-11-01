/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Toggle_Layer_DescriptionInputs */



/**
* | output |
* | --- |
* | "Show or hide a map layer by id. Call list-map-layers first to find valid ids." |
*
* @param {Webmcp_Toggle_Layer_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_description = /** @type {((inputs?: Webmcp_Toggle_Layer_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Wys of versteek 'n kaartlaag volgens id. Roep eers list-map-layers om geldige id's te vind.")
	return /** @type {LocalizedString} */ ("Show or hide a map layer by id. Call list-map-layers first to find valid ids.")
});