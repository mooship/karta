/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Toggle_Layer_Input_Layer_IdInputs */

const en_webmcp_toggle_layer_input_layer_id = /** @type {(inputs: Webmcp_Toggle_Layer_Input_Layer_IdInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The layer's id, as returned by list-map-layers.`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_input_layer_id = /** @type {((inputs?: Webmcp_Toggle_Layer_Input_Layer_IdInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_Input_Layer_IdInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_toggle_layer_input_layer_id(inputs)
	return en_webmcp_toggle_layer_input_layer_id(inputs)
});