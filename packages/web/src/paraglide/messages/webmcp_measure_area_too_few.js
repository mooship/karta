/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Area_Too_FewInputs */



/**
* | output |
* | --- |
* | "Provide at least three locations to measure an area." |
*
* @param {Webmcp_Measure_Area_Too_FewInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_area_too_few = /** @type {((inputs?: Webmcp_Measure_Area_Too_FewInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_Too_FewInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Verskaf ten minste drie plekke om 'n area te meet.")
	return /** @type {LocalizedString} */ ("Provide at least three locations to measure an area.")
});