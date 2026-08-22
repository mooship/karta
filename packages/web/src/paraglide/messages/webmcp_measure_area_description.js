/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Area_DescriptionInputs */

const en_webmcp_measure_area_description = /** @type {(inputs: Webmcp_Measure_Area_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Measure the area enclosed by three or more named locations, and show it on the map's measuring tool.`)
};

const af_webmcp_measure_area_description = /** @type {(inputs: Webmcp_Measure_Area_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Meet die area wat deur drie of meer benoemde plekke omsluit word, en wys dit op die kaart se meetnutsding.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_measure_area_description(inputs)
	return en_webmcp_measure_area_description(inputs)
});