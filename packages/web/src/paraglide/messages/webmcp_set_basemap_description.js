/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Set_Basemap_DescriptionInputs */

const en_webmcp_set_basemap_description = /** @type {(inputs: Webmcp_Set_Basemap_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Switch the map's basemap style.`)
};

const st_webmcp_set_basemap_description = /** @type {(inputs: Webmcp_Set_Basemap_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fetola setaele sa 'mapa oa motheo.`)
};

const zu_webmcp_set_basemap_description = /** @type {(inputs: Webmcp_Set_Basemap_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shintsha isitayela sebalazwe elingumsuka.`)
};

const xh_webmcp_set_basemap_description = /** @type {(inputs: Webmcp_Set_Basemap_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tshintsha isimbo semephu esisisiseko.`)
};

const af_webmcp_set_basemap_description = /** @type {(inputs: Webmcp_Set_Basemap_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verander die kaart se basiskaartstyl.`)
};

/**
* | output |
* | --- |
* | "Switch the map's basemap style." |
*
* @param {Webmcp_Set_Basemap_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_basemap_description = /** @type {((inputs?: Webmcp_Set_Basemap_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_DescriptionInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_set_basemap_description(inputs)
	if (locale === "zu") return zu_webmcp_set_basemap_description(inputs)
	if (locale === "xh") return xh_webmcp_set_basemap_description(inputs)
	if (locale === "af") return af_webmcp_set_basemap_description(inputs)
	return en_webmcp_set_basemap_description(inputs)
});