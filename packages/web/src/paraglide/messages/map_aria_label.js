/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Map_Aria_LabelInputs */

const en_map_aria_label = /** @type {(inputs: Map_Aria_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Map of South African township access to job centres`)
};

/**
* | output |
* | --- |
* | "Map of South African township access to job centres" |
*
* @param {Map_Aria_LabelInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const map_aria_label = /** @type {((inputs?: Map_Aria_LabelInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Map_Aria_LabelInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_map_aria_label(inputs)
});