/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Area_Input_LocationsInputs */

const en_webmcp_measure_area_input_locations = /** @type {(inputs: Webmcp_Measure_Area_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Place names forming the area's outline, in order, e.g. ["Sandton", "Soweto", "Midrand"].`)
};

const st_webmcp_measure_area_input_locations = /** @type {(inputs: Webmcp_Measure_Area_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mabitso a libaka a etsang moeli wa sebaka, ka tatellano, mohlala ["Sandton", "Soweto", "Midrand"].`)
};

const zu_webmcp_measure_area_input_locations = /** @type {(inputs: Webmcp_Measure_Area_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amagama ezindawo akha umugqa wangaphandle wendawo, ngokulandelana, isb. ["Sandton", "Soweto", "Midrand"].`)
};

const xh_webmcp_measure_area_input_locations = /** @type {(inputs: Webmcp_Measure_Area_Input_LocationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amagama eendawo akha umda wendawo, ngokulandelelana, umz. ["Sandton", "Soweto", "Midrand"].`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_area_input_locations = /** @type {((inputs?: Webmcp_Measure_Area_Input_LocationsInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_Input_LocationsInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_measure_area_input_locations(inputs)
	if (locale === "zu") return zu_webmcp_measure_area_input_locations(inputs)
	if (locale === "xh") return xh_webmcp_measure_area_input_locations(inputs)
	if (locale === "af") return af_webmcp_measure_area_input_locations(inputs)
	return en_webmcp_measure_area_input_locations(inputs)
});