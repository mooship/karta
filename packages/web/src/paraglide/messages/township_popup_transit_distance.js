/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_Transit_DistanceInputs */

const en_township_popup_transit_distance = /** @type {(inputs: Township_Popup_Transit_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Distance to nearest transit`)
};

const st_township_popup_transit_distance = /** @type {(inputs: Township_Popup_Transit_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bohole ho isa dipalangwaneng tse haufi`)
};

const zu_township_popup_transit_distance = /** @type {(inputs: Township_Popup_Transit_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibanga eliya ezokuthutha eziseduze`)
};

const xh_township_popup_transit_distance = /** @type {(inputs: Township_Popup_Transit_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umgama oya ezokuthutha ezikufuphi`)
};

const af_township_popup_transit_distance = /** @type {(inputs: Township_Popup_Transit_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Afstand tot naaste vervoer`)
};

/**
* | output |
* | --- |
* | "Distance to nearest transit" |
*
* @param {Township_Popup_Transit_DistanceInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const township_popup_transit_distance = /** @type {((inputs?: Township_Popup_Transit_DistanceInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_Transit_DistanceInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_township_popup_transit_distance(inputs)
	if (locale === "zu") return zu_township_popup_transit_distance(inputs)
	if (locale === "xh") return xh_township_popup_transit_distance(inputs)
	if (locale === "af") return af_township_popup_transit_distance(inputs)
	return en_township_popup_transit_distance(inputs)
});