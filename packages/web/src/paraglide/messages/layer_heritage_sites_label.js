/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Heritage_Sites_LabelInputs */

const en_layer_heritage_sites_label = /** @type {(inputs: Layer_Heritage_Sites_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Struggle heritage sites`)
};

const st_layer_heritage_sites_label = /** @type {(inputs: Layer_Heritage_Sites_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mafelo a bohwa ba ntwa ya tokoloho`)
};

const zu_layer_heritage_sites_label = /** @type {(inputs: Layer_Heritage_Sites_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Izindawo zefa lomzabalazo`)
};

const xh_layer_heritage_sites_label = /** @type {(inputs: Layer_Heritage_Sites_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iindawo zelifa lomzabalazo`)
};

const af_layer_heritage_sites_label = /** @type {(inputs: Layer_Heritage_Sites_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erfenisplekke van die vryheidstryd`)
};

/**
* | output |
* | --- |
* | "Struggle heritage sites" |
*
* @param {Layer_Heritage_Sites_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_heritage_sites_label = /** @type {((inputs?: Layer_Heritage_Sites_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Heritage_Sites_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_heritage_sites_label(inputs)
	if (locale === "zu") return zu_layer_heritage_sites_label(inputs)
	if (locale === "xh") return xh_layer_heritage_sites_label(inputs)
	if (locale === "af") return af_layer_heritage_sites_label(inputs)
	return en_layer_heritage_sites_label(inputs)
});