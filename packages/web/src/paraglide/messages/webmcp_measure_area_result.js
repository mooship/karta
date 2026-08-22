/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ locations: NonNullable<unknown>, result: NonNullable<unknown> }} Webmcp_Measure_Area_ResultInputs */

const en_webmcp_measure_area_result = /** @type {(inputs: Webmcp_Measure_Area_ResultInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Area enclosed by ${i?.locations}: ${i?.result}.`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_area_result = /** @type {((inputs: Webmcp_Measure_Area_ResultInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_ResultInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_measure_area_result(inputs)
	return en_webmcp_measure_area_result(inputs)
});