/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Set_Basemap_Input_BasemapInputs */

const en_webmcp_set_basemap_input_basemap = /** @type {(inputs: Webmcp_Set_Basemap_Input_BasemapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One of the registered basemap ids.`)
};

const af_webmcp_set_basemap_input_basemap = /** @type {(inputs: Webmcp_Set_Basemap_Input_BasemapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Een van die geregistreerde basiskaart-id's.`)
};

/**
* | output |
* | --- |
* | "One of the registered basemap ids." |
*
* @param {Webmcp_Set_Basemap_Input_BasemapInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_basemap_input_basemap = /** @type {((inputs?: Webmcp_Set_Basemap_Input_BasemapInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_Input_BasemapInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_set_basemap_input_basemap(inputs)
	return en_webmcp_set_basemap_input_basemap(inputs)
});