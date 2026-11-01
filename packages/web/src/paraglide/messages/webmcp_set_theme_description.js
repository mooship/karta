/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Set_Theme_DescriptionInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Verander die app se kleurtema. \"system\" volg die bedryfstelsel se voorkeur.")
	return /** @type {LocalizedString} */ ("Switch the app's colour theme. \"system\" follows the OS preference.")
});