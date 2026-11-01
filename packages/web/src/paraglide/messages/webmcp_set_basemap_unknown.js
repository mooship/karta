/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ basemap: NonNullable<unknown> }} Webmcp_Set_Basemap_UnknownInputs */



/**
* | output |
* | --- |
* | "Unknown basemap \"{basemap}\"." |
*
* @param {Webmcp_Set_Basemap_UnknownInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_basemap_unknown = /** @type {((inputs: Webmcp_Set_Basemap_UnknownInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_UnknownInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Onbekende basiskaart "${i?.basemap}".`)
	return /** @type {LocalizedString} */ (`Unknown basemap "${i?.basemap}".`)
});