/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ basemap: NonNullable<unknown> }} Webmcp_Set_Basemap_SwitchedInputs */

const en_webmcp_set_basemap_switched = /** @type {(inputs: Webmcp_Set_Basemap_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Basemap switched to "${i?.basemap}".`)
};

const st_webmcp_set_basemap_switched = /** @type {(inputs: Webmcp_Set_Basemap_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`'Mapa oa motheo o fetoletsoe ho "${i?.basemap}".`)
};

const zu_webmcp_set_basemap_switched = /** @type {(inputs: Webmcp_Set_Basemap_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ibalazwe elingumsuka lishintshelwe ku-"${i?.basemap}".`)
};

const xh_webmcp_set_basemap_switched = /** @type {(inputs: Webmcp_Set_Basemap_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Imephu esisiseko itshintshelwe ku-"${i?.basemap}".`)
};

const af_webmcp_set_basemap_switched = /** @type {(inputs: Webmcp_Set_Basemap_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Basiskaart verander na "${i?.basemap}".`)
};

/**
* | output |
* | --- |
* | "Basemap switched to \"{basemap}\"." |
*
* @param {Webmcp_Set_Basemap_SwitchedInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_basemap_switched = /** @type {((inputs: Webmcp_Set_Basemap_SwitchedInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Basemap_SwitchedInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_set_basemap_switched(inputs)
	if (locale === "zu") return zu_webmcp_set_basemap_switched(inputs)
	if (locale === "xh") return xh_webmcp_set_basemap_switched(inputs)
	if (locale === "af") return af_webmcp_set_basemap_switched(inputs)
	return en_webmcp_set_basemap_switched(inputs)
});