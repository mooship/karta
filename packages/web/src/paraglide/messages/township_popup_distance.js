/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_DistanceInputs */

const en_township_popup_distance = /** @type {(inputs: Township_Popup_DistanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Distance`)
};

/**
* | output |
* | --- |
* | "Distance" |
*
* @param {Township_Popup_DistanceInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const township_popup_distance = /** @type {((inputs?: Township_Popup_DistanceInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_DistanceInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_township_popup_distance(inputs)
});