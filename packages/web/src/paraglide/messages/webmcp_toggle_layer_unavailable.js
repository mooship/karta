/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Webmcp_Toggle_Layer_UnavailableInputs */

const en_webmcp_toggle_layer_unavailable = /** @type {(inputs: Webmcp_Toggle_Layer_UnavailableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Layer "${i?.label}" isn't available yet.`)
};

const st_webmcp_toggle_layer_unavailable = /** @type {(inputs: Webmcp_Toggle_Layer_UnavailableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Karolo "${i?.label}" ha e so fumanehe.`)
};

const zu_webmcp_toggle_layer_unavailable = /** @type {(inputs: Webmcp_Toggle_Layer_UnavailableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Isendlalelo "${i?.label}" asikatholakali.`)
};

const xh_webmcp_toggle_layer_unavailable = /** @type {(inputs: Webmcp_Toggle_Layer_UnavailableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ileya "${i?.label}" ayikafumaneki.`)
};

const af_webmcp_toggle_layer_unavailable = /** @type {(inputs: Webmcp_Toggle_Layer_UnavailableInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Laag "${i?.label}" is nog nie beskikbaar nie.`)
};

/**
* | output |
* | --- |
* | "Layer \"{label}\" isn't available yet." |
*
* @param {Webmcp_Toggle_Layer_UnavailableInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_unavailable = /** @type {((inputs: Webmcp_Toggle_Layer_UnavailableInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_UnavailableInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_toggle_layer_unavailable(inputs)
	if (locale === "zu") return zu_webmcp_toggle_layer_unavailable(inputs)
	if (locale === "xh") return xh_webmcp_toggle_layer_unavailable(inputs)
	if (locale === "af") return af_webmcp_toggle_layer_unavailable(inputs)
	return en_webmcp_toggle_layer_unavailable(inputs)
});