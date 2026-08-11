/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_PopulationInputs */

const en_township_popup_population = /** @type {(inputs: Township_Popup_PopulationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Population`)
};

/**
* | output |
* | --- |
* | "Population" |
*
* @param {Township_Popup_PopulationInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const township_popup_population = /** @type {((inputs?: Township_Popup_PopulationInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_PopulationInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_township_popup_population(inputs)
});