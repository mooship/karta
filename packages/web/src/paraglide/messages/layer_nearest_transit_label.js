/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Nearest_Transit_LabelInputs */

const en_layer_nearest_transit_label = /** @type {(inputs: Layer_Nearest_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Distance to nearest transit`)
};

const st_layer_nearest_transit_label = /** @type {(inputs: Layer_Nearest_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bohole ho isa dipalangwaneng tse haufi`)
};

const zu_layer_nearest_transit_label = /** @type {(inputs: Layer_Nearest_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibanga eliya ezokuthutha eziseduze`)
};

const xh_layer_nearest_transit_label = /** @type {(inputs: Layer_Nearest_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umgama oya ezokuthutha ezikufuphi`)
};

const af_layer_nearest_transit_label = /** @type {(inputs: Layer_Nearest_Transit_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afstand tot naaste vervoer`)
};

/**
* | output |
* | --- |
* | "Distance to nearest transit" |
*
* @param {Layer_Nearest_Transit_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_nearest_transit_label = /** @type {((inputs?: Layer_Nearest_Transit_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Nearest_Transit_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_nearest_transit_label(inputs)
	if (locale === "zu") return zu_layer_nearest_transit_label(inputs)
	if (locale === "xh") return xh_layer_nearest_transit_label(inputs)
	if (locale === "af") return af_layer_nearest_transit_label(inputs)
	return en_layer_nearest_transit_label(inputs)
});