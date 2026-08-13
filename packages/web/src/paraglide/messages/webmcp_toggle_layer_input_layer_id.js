/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Toggle_Layer_Input_Layer_IdInputs */

const en_webmcp_toggle_layer_input_layer_id = /** @type {(inputs: Webmcp_Toggle_Layer_Input_Layer_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The layer's id, as returned by list-map-layers.`)
};

const st_webmcp_toggle_layer_input_layer_id = /** @type {(inputs: Webmcp_Toggle_Layer_Input_Layer_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Id ea karolo, joalo ka ha e khutlisoa ke list-map-layers.`)
};

const zu_webmcp_toggle_layer_input_layer_id = /** @type {(inputs: Webmcp_Toggle_Layer_Input_Layer_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I-id yesendlalelo, njengoba ibuyiswa yi-list-map-layers.`)
};

const xh_webmcp_toggle_layer_input_layer_id = /** @type {(inputs: Webmcp_Toggle_Layer_Input_Layer_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I-id yeleya, njengoko ibuyiswa yi-list-map-layers.`)
};

const af_webmcp_toggle_layer_input_layer_id = /** @type {(inputs: Webmcp_Toggle_Layer_Input_Layer_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die laag se id, soos deur list-map-layers teruggegee.`)
};

/**
* | output |
* | --- |
* | "The layer's id, as returned by list-map-layers." |
*
* @param {Webmcp_Toggle_Layer_Input_Layer_IdInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_input_layer_id = /** @type {((inputs?: Webmcp_Toggle_Layer_Input_Layer_IdInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_Input_Layer_IdInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_toggle_layer_input_layer_id(inputs)
	if (locale === "zu") return zu_webmcp_toggle_layer_input_layer_id(inputs)
	if (locale === "xh") return xh_webmcp_toggle_layer_input_layer_id(inputs)
	if (locale === "af") return af_webmcp_toggle_layer_input_layer_id(inputs)
	return en_webmcp_toggle_layer_input_layer_id(inputs)
});