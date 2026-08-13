/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_List_Layers_EmptyInputs */

const en_webmcp_list_layers_empty = /** @type {(inputs: Webmcp_List_Layers_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This map has no layers available.`)
};

const st_webmcp_list_layers_empty = /** @type {(inputs: Webmcp_List_Layers_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`'Mapa ona ha o na dikarolo tse fumanehang.`)
};

const zu_webmcp_list_layers_empty = /** @type {(inputs: Webmcp_List_Layers_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leli balazwe alinazo izendlalelo ezitholakalayo.`)
};

const xh_webmcp_list_layers_empty = /** @type {(inputs: Webmcp_List_Layers_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le mephu ayinazo iileya ezifumanekayo.`)
};

const af_webmcp_list_layers_empty = /** @type {(inputs: Webmcp_List_Layers_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hierdie kaart het geen lae beskikbaar nie.`)
};

/**
* | output |
* | --- |
* | "This map has no layers available." |
*
* @param {Webmcp_List_Layers_EmptyInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_list_layers_empty = /** @type {((inputs?: Webmcp_List_Layers_EmptyInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_List_Layers_EmptyInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_list_layers_empty(inputs)
	if (locale === "zu") return zu_webmcp_list_layers_empty(inputs)
	if (locale === "xh") return xh_webmcp_list_layers_empty(inputs)
	if (locale === "af") return af_webmcp_list_layers_empty(inputs)
	return en_webmcp_list_layers_empty(inputs)
});