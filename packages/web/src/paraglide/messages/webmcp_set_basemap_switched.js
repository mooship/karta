/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ basemap: NonNullable<unknown> }} Webmcp_Set_Basemap_SwitchedInputs */



/**
* | output |
* | --- |
* | "Basemap switched to \"{basemap}\"." |
*
* @param {Webmcp_Set_Basemap_SwitchedInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_basemap_switched = /** @type {((inputs: Webmcp_Set_Basemap_SwitchedInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_SwitchedInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Basiskaart verander na "${i?.basemap}".`)
	return /** @type {LocalizedString} */ (`Basemap switched to "${i?.basemap}".`)
});