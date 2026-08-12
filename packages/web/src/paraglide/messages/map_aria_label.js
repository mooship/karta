/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Map_Aria_LabelInputs */

const en_map_aria_label = /** @type {(inputs: Map_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map of South African township access to job centres`)
};

const st_map_aria_label = /** @type {(inputs: Map_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`'Mapa wa phihlello ya metse ya Aforika Borwa dibakeng tsa mesebetsi`)
};

const zu_map_aria_label = /** @type {(inputs: Map_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibalazwe lokufinyelela kwamalokishi aseNingizimu Afrika ezindaweni zomsebenzi`)
};

const xh_map_aria_label = /** @type {(inputs: Map_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Imephu yokufikelela kwamalokishi aseMzantsi Afrika kwiindawo zomsebenzi`)
};

const af_map_aria_label = /** @type {(inputs: Map_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kaart van Suid-Afrikaanse lokasies se toegang tot werksentrums`)
};

/**
* | output |
* | --- |
* | "Map of South African township access to job centres" |
*
* @param {Map_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const map_aria_label = /** @type {((inputs?: Map_Aria_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Map_Aria_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_map_aria_label(inputs)
	if (locale === "zu") return zu_map_aria_label(inputs)
	if (locale === "xh") return xh_map_aria_label(inputs)
	if (locale === "af") return af_map_aria_label(inputs)
	return en_map_aria_label(inputs)
});