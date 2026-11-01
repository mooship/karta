/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ theme: NonNullable<unknown> }} Webmcp_Set_Theme_UnknownInputs */



/**
* | output |
* | --- |
* | "Unknown theme \"{theme}\"." |
*
* @param {Webmcp_Set_Theme_UnknownInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_theme_unknown = /** @type {((inputs: Webmcp_Set_Theme_UnknownInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Theme_UnknownInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Onbekende tema "${i?.theme}".`)
	return /** @type {LocalizedString} */ (`Unknown theme "${i?.theme}".`)
});