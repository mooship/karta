/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Distance_DescriptionInputs */

const en_webmcp_measure_distance_description = /** @type {(inputs: Webmcp_Measure_Distance_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Measure the straight-line distance across two or more named locations, and show it on the map's measuring tool.`)
};

const af_webmcp_measure_distance_description = /** @type {(inputs: Webmcp_Measure_Distance_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Meet die reguitlyn-afstand oor twee of meer benoemde plekke, en wys dit op die kaart se meetnutsding.`)
};

/**
* | output |
* | --- |
* | "Measure the straight-line distance across two or more named locations, and show it on the map's measuring tool." |
*
* @param {Webmcp_Measure_Distance_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_distance_description = /** @type {((inputs?: Webmcp_Measure_Distance_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Distance_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_measure_distance_description(inputs)
	return en_webmcp_measure_distance_description(inputs)
});