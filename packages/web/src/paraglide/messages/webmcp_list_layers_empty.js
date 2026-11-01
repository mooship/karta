/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_List_Layers_EmptyInputs */



/**
* | output |
* | --- |
* | "This map has no layers available." |
*
* @param {Webmcp_List_Layers_EmptyInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_list_layers_empty = /** @type {((inputs?: Webmcp_List_Layers_EmptyInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_List_Layers_EmptyInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Hierdie kaart het geen lae beskikbaar nie.")
	return /** @type {LocalizedString} */ ("This map has no layers available.")
});