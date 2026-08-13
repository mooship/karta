/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ layerId: NonNullable<unknown> }} Webmcp_Toggle_Layer_UnknownInputs */

const en_webmcp_toggle_layer_unknown = /** @type {(inputs: Webmcp_Toggle_Layer_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No layer with id "${i?.layerId}". Call list-map-layers to see valid ids.`)
};

const st_webmcp_toggle_layer_unknown = /** @type {(inputs: Webmcp_Toggle_Layer_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ha ho karolo e nang le id ea "${i?.layerId}". Bitsa list-map-layers ho bona di-id tse sebetsang.`)
};

const zu_webmcp_toggle_layer_unknown = /** @type {(inputs: Webmcp_Toggle_Layer_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Asikho isendlalelo esine-id ethi "${i?.layerId}". Sebenzisa i-list-map-layers ukuze ubone ama-id asebenzayo.`)
};

const xh_webmcp_toggle_layer_unknown = /** @type {(inputs: Webmcp_Toggle_Layer_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Akukho leya ine-id ethi "${i?.layerId}". Sebenzisa i-list-map-layers ukubona ii-id ezisebenzayo.`)
};

const af_webmcp_toggle_layer_unknown = /** @type {(inputs: Webmcp_Toggle_Layer_UnknownInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Geen laag met id "${i?.layerId}" nie. Roep list-map-layers om geldige id's te sien.`)
};

/**
* | output |
* | --- |
* | "No layer with id \"{layerId}\". Call list-map-layers to see valid ids." |
*
* @param {Webmcp_Toggle_Layer_UnknownInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_unknown = /** @type {((inputs: Webmcp_Toggle_Layer_UnknownInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_UnknownInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_toggle_layer_unknown(inputs)
	if (locale === "zu") return zu_webmcp_toggle_layer_unknown(inputs)
	if (locale === "xh") return xh_webmcp_toggle_layer_unknown(inputs)
	if (locale === "af") return af_webmcp_toggle_layer_unknown(inputs)
	return en_webmcp_toggle_layer_unknown(inputs)
});