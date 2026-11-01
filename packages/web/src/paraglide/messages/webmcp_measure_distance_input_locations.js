/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Distance_Input_LocationsInputs */



/**
* | output |
* | --- |
* | "Place names to measure between, in order, e.g. [\"Sandton\", \"Soweto\"]." |
*
* @param {Webmcp_Measure_Distance_Input_LocationsInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_distance_input_locations = /** @type {((inputs?: Webmcp_Measure_Distance_Input_LocationsInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Distance_Input_LocationsInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Pleknname om tussen te meet, in volgorde, bv. [\"Sandton\", \"Soweto\"].")
	return /** @type {LocalizedString} */ ("Place names to measure between, in order, e.g. [\"Sandton\", \"Soweto\"].")
});