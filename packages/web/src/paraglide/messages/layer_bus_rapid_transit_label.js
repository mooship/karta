/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Bus_Rapid_Transit_LabelInputs */

const en_layer_bus_rapid_transit_label = /** @type {(inputs: Layer_Bus_Rapid_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bus Rapid Transit`)
};

const st_layer_bus_rapid_transit_label = /** @type {(inputs: Layer_Bus_Rapid_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bese e Potlakileng`)
};

const zu_layer_bus_rapid_transit_label = /** @type {(inputs: Layer_Bus_Rapid_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibhasi Elisheshayo`)
};

const xh_layer_bus_rapid_transit_label = /** @type {(inputs: Layer_Bus_Rapid_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibhasi Ekhawulezayo`)
};

const af_layer_bus_rapid_transit_label = /** @type {(inputs: Layer_Bus_Rapid_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Snelbus`)
};

/**
* | output |
* | --- |
* | "Bus Rapid Transit" |
*
* @param {Layer_Bus_Rapid_Transit_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_bus_rapid_transit_label = /** @type {((inputs?: Layer_Bus_Rapid_Transit_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Bus_Rapid_Transit_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_bus_rapid_transit_label(inputs)
	if (locale === "zu") return zu_layer_bus_rapid_transit_label(inputs)
	if (locale === "xh") return xh_layer_bus_rapid_transit_label(inputs)
	if (locale === "af") return af_layer_bus_rapid_transit_label(inputs)
	return en_layer_bus_rapid_transit_label(inputs)
});