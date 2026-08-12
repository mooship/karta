/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Township_Popup_Car_TimeInputs */

const en_township_popup_car_time = /** @type {(inputs: Township_Popup_Car_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modelled car time`)
};

const st_township_popup_car_time = /** @type {(inputs: Township_Popup_Car_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nako ya koloi e akantsweng`)
};

const zu_township_popup_car_time = /** @type {(inputs: Township_Popup_Car_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Isikhathi semoto esilinganiselwe`)
};

const xh_township_popup_car_time = /** @type {(inputs: Township_Popup_Car_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ixesha lemoto elilinganiselweyo`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const township_popup_car_time = /** @type {((inputs?: Township_Popup_Car_TimeInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Township_Popup_Car_TimeInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_township_popup_car_time(inputs)
	if (locale === "zu") return zu_township_popup_car_time(inputs)
	if (locale === "xh") return xh_township_popup_car_time(inputs)
	if (locale === "af") return af_township_popup_car_time(inputs)
	return en_township_popup_car_time(inputs)
});