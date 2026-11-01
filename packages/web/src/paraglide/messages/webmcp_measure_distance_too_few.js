/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Distance_Too_FewInputs */



/**
* | output |
* | --- |
* | "Provide at least two locations to measure a distance." |
*
* @param {Webmcp_Measure_Distance_Too_FewInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_distance_too_few = /** @type {((inputs?: Webmcp_Measure_Distance_Too_FewInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Distance_Too_FewInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Verskaf ten minste twee plekke om 'n afstand te meet.")
	return /** @type {LocalizedString} */ ("Provide at least two locations to measure a distance.")
});