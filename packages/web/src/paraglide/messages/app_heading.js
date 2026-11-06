/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_HeadingInputs */



/**
* | output |
* | --- |
* | "Karta: spatial legacy map of Gauteng and Cape Town" |
*
* @param {App_HeadingInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const app_heading = /** @type {((inputs?: App_HeadingInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_HeadingInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Karta: ruimtelike erfeniskaart van Gauteng en Kaapstad")
	return /** @type {LocalizedString} */ ("Karta: spatial legacy map of Gauteng and Cape Town")
});