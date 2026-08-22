/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_Car_TimeInputs */

const en_township_popup_car_time = /** @type {(inputs: Township_Popup_Car_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modelled car time`)
};

const af_township_popup_car_time = /** @type {(inputs: Township_Popup_Car_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gemodelleerde motortyd`)
};

/**
* | output |
* | --- |
* | "Modelled car time" |
*
* @param {Township_Popup_Car_TimeInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const township_popup_car_time = /** @type {((inputs?: Township_Popup_Car_TimeInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_Car_TimeInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_township_popup_car_time(inputs)
	return en_township_popup_car_time(inputs)
});