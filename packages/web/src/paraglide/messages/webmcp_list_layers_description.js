/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_List_Layers_DescriptionInputs */

const en_webmcp_list_layers_description = /** @type {(inputs: Webmcp_List_Layers_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`List this map's layers, each with its id, label, and whether it's currently visible.`)
};

const af_webmcp_list_layers_description = /** @type {(inputs: Webmcp_List_Layers_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lys hierdie kaart se lae, elk met sy id, etiket, en of dit tans sigbaar is.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_list_layers_description(inputs)
	return en_webmcp_list_layers_description(inputs)
});