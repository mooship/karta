/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Distance_DescriptionInputs */

const en_webmcp_measure_distance_description = /** @type {(inputs: Webmcp_Measure_Distance_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Measure the straight-line distance across two or more named locations, and show it on the map's measuring tool.`)
};

const st_webmcp_measure_distance_description = /** @type {(inputs: Webmcp_Measure_Distance_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lekanya sebaka se otlolohileng pakeng tsa libaka tse peli kapa ho feta tse rehilweng ka mabitso, mme u se bontshe seselisong sa ho lekanya sa 'mapa.`)
};

const zu_webmcp_measure_distance_description = /** @type {(inputs: Webmcp_Measure_Distance_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kala ibanga eliqondile phakathi kwezindawo ezimbili noma ngaphezulu eziqanjiwe, bese ulibonisa ethuluzini lokukala lebalazwe.`)
};

const xh_webmcp_measure_distance_description = /** @type {(inputs: Webmcp_Measure_Distance_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Linganisa umgama othe ngqo phakathi kweendawo ezimbini okanye ngaphezulu ezichaziweyo ngamagama, uze uwubonise kwisixhobo sokulinganisa semephu.`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_distance_description = /** @type {((inputs?: Webmcp_Measure_Distance_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Distance_DescriptionInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_measure_distance_description(inputs)
	if (locale === "zu") return zu_webmcp_measure_distance_description(inputs)
	if (locale === "xh") return xh_webmcp_measure_distance_description(inputs)
	if (locale === "af") return af_webmcp_measure_distance_description(inputs)
	return en_webmcp_measure_distance_description(inputs)
});