/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ basemap: NonNullable<unknown> }} Webmcp_Set_Basemap_UnknownInputs */

const en_webmcp_set_basemap_unknown = /** @type {(inputs: Webmcp_Set_Basemap_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Unknown basemap "${i?.basemap}".`)
};

const af_webmcp_set_basemap_unknown = /** @type {(inputs: Webmcp_Set_Basemap_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Onbekende basiskaart "${i?.basemap}".`)
};

/**
* | output |
* | --- |
* | "Unknown basemap \"{basemap}\"." |
*
* @param {Webmcp_Set_Basemap_UnknownInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_basemap_unknown = /** @type {((inputs: Webmcp_Set_Basemap_UnknownInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_UnknownInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_set_basemap_unknown(inputs)
	return en_webmcp_set_basemap_unknown(inputs)
});