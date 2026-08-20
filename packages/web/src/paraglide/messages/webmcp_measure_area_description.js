/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Area_DescriptionInputs */

const en_webmcp_measure_area_description = /** @type {(inputs: Webmcp_Measure_Area_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Measure the area enclosed by three or more named locations, and show it on the map's measuring tool.`)
};

const st_webmcp_measure_area_description = /** @type {(inputs: Webmcp_Measure_Area_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lekanya sebaka se kwahetsweng ke libaka tse tharo kapa ho feta tse rehilweng ka mabitso, mme u se bontshe seselisong sa ho lekanya sa 'mapa.`)
};

const zu_webmcp_measure_area_description = /** @type {(inputs: Webmcp_Measure_Area_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kala indawo ezungezwe izindawo ezintathu noma ngaphezulu eziqanjiwe, bese uyibonisa ethuluzini lokukala lebalazwe.`)
};

const xh_webmcp_measure_area_description = /** @type {(inputs: Webmcp_Measure_Area_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Linganisa indawo ezungezwe ziindawo ezintathu okanye ngaphezulu ezichaziweyo ngamagama, uze uyibonise kwisixhobo sokulinganisa semephu.`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_area_description = /** @type {((inputs?: Webmcp_Measure_Area_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_DescriptionInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_measure_area_description(inputs)
	if (locale === "zu") return zu_webmcp_measure_area_description(inputs)
	if (locale === "xh") return xh_webmcp_measure_area_description(inputs)
	if (locale === "af") return af_webmcp_measure_area_description(inputs)
	return en_webmcp_measure_area_description(inputs)
});