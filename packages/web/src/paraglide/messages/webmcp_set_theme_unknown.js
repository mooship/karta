/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ theme: NonNullable<unknown> }} Webmcp_Set_Theme_UnknownInputs */

const en_webmcp_set_theme_unknown = /** @type {(inputs: Webmcp_Set_Theme_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Unknown theme "${i?.theme}".`)
};

const af_webmcp_set_theme_unknown = /** @type {(inputs: Webmcp_Set_Theme_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Onbekende tema "${i?.theme}".`)
};

/**
* | output |
* | --- |
* | "Unknown theme \"{theme}\"." |
*
* @param {Webmcp_Set_Theme_UnknownInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_theme_unknown = /** @type {((inputs: Webmcp_Set_Theme_UnknownInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Theme_UnknownInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_set_theme_unknown(inputs)
	return en_webmcp_set_theme_unknown(inputs)
});