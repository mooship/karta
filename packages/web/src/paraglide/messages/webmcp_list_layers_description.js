/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_List_Layers_DescriptionInputs */

const en_webmcp_list_layers_description = /** @type {(inputs: Webmcp_List_Layers_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`List this map's layers, each with its id, label, and whether it's currently visible.`)
};

const st_webmcp_list_layers_description = /** @type {(inputs: Webmcp_List_Layers_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Thathela pele dikarolo tsa 'mapa ona, e nngwe le e nngwe ka id ya yona, lebitso, le hore na e bonahala hona jwale.`)
};

const zu_webmcp_list_layers_description = /** @type {(inputs: Webmcp_List_Layers_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bala izendlalelo zaleli balazwe, ngayinye ne-id yayo, ilebula, nokuthi ibonakala yini njengamanje.`)
};

const xh_webmcp_list_layers_description = /** @type {(inputs: Webmcp_List_Layers_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dwelisa iileya zale mephu, nganye ne-id yayo, ilebhile, nokuba iyabonakala na okwangoku.`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_list_layers_description = /** @type {((inputs?: Webmcp_List_Layers_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_List_Layers_DescriptionInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_list_layers_description(inputs)
	if (locale === "zu") return zu_webmcp_list_layers_description(inputs)
	if (locale === "xh") return xh_webmcp_list_layers_description(inputs)
	if (locale === "af") return af_webmcp_list_layers_description(inputs)
	return en_webmcp_list_layers_description(inputs)
});