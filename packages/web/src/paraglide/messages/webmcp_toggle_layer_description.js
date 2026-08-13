/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Toggle_Layer_DescriptionInputs */

const en_webmcp_toggle_layer_description = /** @type {(inputs: Webmcp_Toggle_Layer_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Show or hide a map layer by id. Call list-map-layers first to find valid ids.`)
};

const st_webmcp_toggle_layer_description = /** @type {(inputs: Webmcp_Toggle_Layer_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bontsha kapa u pate karolo ea 'mapa ka id. Bitsa list-map-layers pele ho fumana di-id tse sebetsang.`)
};

const zu_webmcp_toggle_layer_description = /** @type {(inputs: Webmcp_Toggle_Layer_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bonisa noma fihla isendlalelo sebalazwe nge-id. Sebenzisa i-list-map-layers kuqala ukuze uthole ama-id asebenzayo.`)
};

const xh_webmcp_toggle_layer_description = /** @type {(inputs: Webmcp_Toggle_Layer_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bonisa okanye ufihle ileya yemephu nge-id. Sebenzisa i-list-map-layers kuqala ukufumana ii-id ezisebenzayo.`)
};

const af_webmcp_toggle_layer_description = /** @type {(inputs: Webmcp_Toggle_Layer_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wys of versteek 'n kaartlaag volgens id. Roep eers list-map-layers om geldige id's te vind.`)
};

/**
* | output |
* | --- |
* | "Show or hide a map layer by id. Call list-map-layers first to find valid ids." |
*
* @param {Webmcp_Toggle_Layer_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_description = /** @type {((inputs?: Webmcp_Toggle_Layer_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_DescriptionInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_toggle_layer_description(inputs)
	if (locale === "zu") return zu_webmcp_toggle_layer_description(inputs)
	if (locale === "xh") return xh_webmcp_toggle_layer_description(inputs)
	if (locale === "af") return af_webmcp_toggle_layer_description(inputs)
	return en_webmcp_toggle_layer_description(inputs)
});