/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Area_DescriptionInputs */



/**
* | output |
* | --- |
* | "Measure the area enclosed by three or more named locations, and show it on the map's measuring tool." |
*
* @param {Webmcp_Measure_Area_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_area_description = /** @type {((inputs?: Webmcp_Measure_Area_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Meet die area wat deur drie of meer benoemde plekke omsluit word, en wys dit op die kaart se meetnutsding.")
	return /** @type {LocalizedString} */ ("Measure the area enclosed by three or more named locations, and show it on the map's measuring tool.")
});