/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Set_Basemap_DescriptionInputs */

const en_webmcp_set_basemap_description = /** @type {(inputs: Webmcp_Set_Basemap_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Switch the map's basemap style.`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_basemap_description = /** @type {((inputs?: Webmcp_Set_Basemap_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_set_basemap_description(inputs)
	return en_webmcp_set_basemap_description(inputs)
});