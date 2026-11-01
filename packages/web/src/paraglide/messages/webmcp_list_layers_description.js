/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_List_Layers_DescriptionInputs */



/**
* | output |
* | --- |
* | "List this map's layers, each with its id, label, and whether it's currently visible." |
*
* @param {Webmcp_List_Layers_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_list_layers_description = /** @type {((inputs?: Webmcp_List_Layers_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_List_Layers_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Lys hierdie kaart se lae, elk met sy id, etiket, en of dit tans sigbaar is.")
	return /** @type {LocalizedString} */ ("List this map's layers, each with its id, label, and whether it's currently visible.")
});