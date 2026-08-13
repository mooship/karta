/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ basemap: NonNullable<unknown> }} Webmcp_Set_Basemap_UnknownInputs */

const en_webmcp_set_basemap_unknown = /** @type {(inputs: Webmcp_Set_Basemap_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Unknown basemap "${i?.basemap}".`)
};

const st_webmcp_set_basemap_unknown = /** @type {(inputs: Webmcp_Set_Basemap_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`'Mapa oa motheo o sa tsejoeng "${i?.basemap}".`)
};

const zu_webmcp_set_basemap_unknown = /** @type {(inputs: Webmcp_Set_Basemap_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ibalazwe elingumsuka elingaziwa "${i?.basemap}".`)
};

const xh_webmcp_set_basemap_unknown = /** @type {(inputs: Webmcp_Set_Basemap_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Imephu esisiseko engaziwayo "${i?.basemap}".`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_basemap_unknown = /** @type {((inputs: Webmcp_Set_Basemap_UnknownInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_UnknownInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_set_basemap_unknown(inputs)
	if (locale === "zu") return zu_webmcp_set_basemap_unknown(inputs)
	if (locale === "xh") return xh_webmcp_set_basemap_unknown(inputs)
	if (locale === "af") return af_webmcp_set_basemap_unknown(inputs)
	return en_webmcp_set_basemap_unknown(inputs)
});