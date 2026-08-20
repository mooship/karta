/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Distance_Input_LocationsInputs */

const en_webmcp_measure_distance_input_locations = /** @type {(inputs: Webmcp_Measure_Distance_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Place names to measure between, in order, e.g. ["Sandton", "Soweto"].`)
};

const st_webmcp_measure_distance_input_locations = /** @type {(inputs: Webmcp_Measure_Distance_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mabitso a libaka tseo u lekanyang pakeng tsa tsona, ka tatellano, mohlala ["Sandton", "Soweto"].`)
};

const zu_webmcp_measure_distance_input_locations = /** @type {(inputs: Webmcp_Measure_Distance_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amagama ezindawo okumele ukale phakathi kwazo, ngokulandelana, isb. ["Sandton", "Soweto"].`)
};

const xh_webmcp_measure_distance_input_locations = /** @type {(inputs: Webmcp_Measure_Distance_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amagama eendawo ozakulinganisa phakathi kwazo, ngokulandelelana, umz. ["Sandton", "Soweto"].`)
};

const af_webmcp_measure_distance_input_locations = /** @type {(inputs: Webmcp_Measure_Distance_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pleknname om tussen te meet, in volgorde, bv. ["Sandton", "Soweto"].`)
};

/**
* | output |
* | --- |
* | "Place names to measure between, in order, e.g. [\"Sandton\", \"Soweto\"]." |
*
* @param {Webmcp_Measure_Distance_Input_LocationsInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_distance_input_locations = /** @type {((inputs?: Webmcp_Measure_Distance_Input_LocationsInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Distance_Input_LocationsInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_measure_distance_input_locations(inputs)
	if (locale === "zu") return zu_webmcp_measure_distance_input_locations(inputs)
	if (locale === "xh") return xh_webmcp_measure_distance_input_locations(inputs)
	if (locale === "af") return af_webmcp_measure_distance_input_locations(inputs)
	return en_webmcp_measure_distance_input_locations(inputs)
});