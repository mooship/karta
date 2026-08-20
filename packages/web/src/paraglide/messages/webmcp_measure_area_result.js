/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ locations: NonNullable<unknown>, result: NonNullable<unknown> }} Webmcp_Measure_Area_ResultInputs */

const en_webmcp_measure_area_result = /** @type {(inputs: Webmcp_Measure_Area_ResultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Area enclosed by ${i?.locations}: ${i?.result}.`)
};

const st_webmcp_measure_area_result = /** @type {(inputs: Webmcp_Measure_Area_ResultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sebaka se kwahetsweng ke ${i?.locations}: ${i?.result}.`)
};

const zu_webmcp_measure_area_result = /** @type {(inputs: Webmcp_Measure_Area_ResultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Indawo ezungezwe ${i?.locations}: ${i?.result}.`)
};

const xh_webmcp_measure_area_result = /** @type {(inputs: Webmcp_Measure_Area_ResultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Indawo ezungezwe ${i?.locations}: ${i?.result}.`)
};

const af_webmcp_measure_area_result = /** @type {(inputs: Webmcp_Measure_Area_ResultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Area omsluit deur ${i?.locations}: ${i?.result}.`)
};

/**
* | output |
* | --- |
* | "Area enclosed by {locations}: {result}." |
*
* @param {Webmcp_Measure_Area_ResultInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_area_result = /** @type {((inputs: Webmcp_Measure_Area_ResultInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_ResultInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_measure_area_result(inputs)
	if (locale === "zu") return zu_webmcp_measure_area_result(inputs)
	if (locale === "xh") return xh_webmcp_measure_area_result(inputs)
	if (locale === "af") return af_webmcp_measure_area_result(inputs)
	return en_webmcp_measure_area_result(inputs)
});