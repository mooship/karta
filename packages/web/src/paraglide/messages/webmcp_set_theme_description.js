/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Set_Theme_DescriptionInputs */

const en_webmcp_set_theme_description = /** @type {(inputs: Webmcp_Set_Theme_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Switch the app's colour theme. "system" follows the OS preference.`)
};

const af_webmcp_set_theme_description = /** @type {(inputs: Webmcp_Set_Theme_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verander die app se kleurtema. "system" volg die bedryfstelsel se voorkeur.`)
};

/**
* | output |
* | --- |
* | "Switch the app's colour theme. \"system\" follows the OS preference." |
*
* @param {Webmcp_Set_Theme_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_theme_description = /** @type {((inputs?: Webmcp_Set_Theme_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Theme_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_set_theme_description(inputs)
	return en_webmcp_set_theme_description(inputs)
});