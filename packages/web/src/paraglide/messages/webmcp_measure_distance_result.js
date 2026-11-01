/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ locations: NonNullable<unknown>, result: NonNullable<unknown> }} Webmcp_Measure_Distance_ResultInputs */



/**
* | output |
* | --- |
* | "Distance along {locations}: {result}." |
*
* @param {Webmcp_Measure_Distance_ResultInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_distance_result = /** @type {((inputs: Webmcp_Measure_Distance_ResultInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Distance_ResultInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Afstand langs ${i?.locations}: ${i?.result}.`)
	return /** @type {LocalizedString} */ (`Distance along ${i?.locations}: ${i?.result}.`)
});