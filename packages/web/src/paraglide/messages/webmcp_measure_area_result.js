/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ locations: NonNullable<unknown>, result: NonNullable<unknown> }} Webmcp_Measure_Area_ResultInputs */



/**
* | output |
* | --- |
* | "Area enclosed by {locations}: {result}." |
*
* @param {Webmcp_Measure_Area_ResultInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_area_result = /** @type {((inputs: Webmcp_Measure_Area_ResultInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_ResultInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Area omsluit deur ${i?.locations}: ${i?.result}.`)
	return /** @type {LocalizedString} */ (`Area enclosed by ${i?.locations}: ${i?.result}.`)
});