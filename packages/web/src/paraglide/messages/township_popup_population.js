/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_PopulationInputs */

const en_township_popup_population = /** @type {(inputs: Township_Popup_PopulationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Population`)
};

const st_township_popup_population = /** @type {(inputs: Township_Popup_PopulationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Baahi`)
};

const zu_township_popup_population = /** @type {(inputs: Township_Popup_PopulationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inani labantu`)
};

const xh_township_popup_population = /** @type {(inputs: Township_Popup_PopulationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inani labemi`)
};

const af_township_popup_population = /** @type {(inputs: Township_Popup_PopulationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bevolking`)
};

/**
* | output |
* | --- |
* | "Population" |
*
* @param {Township_Popup_PopulationInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const township_popup_population = /** @type {((inputs?: Township_Popup_PopulationInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_PopulationInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_township_popup_population(inputs)
	if (locale === "zu") return zu_township_popup_population(inputs)
	if (locale === "xh") return xh_township_popup_population(inputs)
	if (locale === "af") return af_township_popup_population(inputs)
	return en_township_popup_population(inputs)
});