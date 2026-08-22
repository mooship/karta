/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Area_Input_LocationsInputs */

const en_webmcp_measure_area_input_locations = /** @type {(inputs: Webmcp_Measure_Area_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Place names forming the area's outline, in order, e.g. ["Sandton", "Soweto", "Midrand"].`)
};

const af_webmcp_measure_area_input_locations = /** @type {(inputs: Webmcp_Measure_Area_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pleknname wat die area se buitelyn vorm, in volgorde, bv. ["Sandton", "Soweto", "Midrand"].`)
};

/**
* | output |
* | --- |
* | "Place names forming the area's outline, in order, e.g. [\"Sandton\", \"Soweto\", \"Midrand\"]." |
*
* @param {Webmcp_Measure_Area_Input_LocationsInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_area_input_locations = /** @type {((inputs?: Webmcp_Measure_Area_Input_LocationsInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_Input_LocationsInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_webmcp_measure_area_input_locations(inputs)
	return en_webmcp_measure_area_input_locations(inputs)
});