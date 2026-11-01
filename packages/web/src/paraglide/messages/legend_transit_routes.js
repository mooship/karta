/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_Transit_RoutesInputs */



/**
* | output |
* | --- |
* | "Transit routes" |
*
* @param {Legend_Transit_RoutesInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_transit_routes = /** @type {((inputs?: Legend_Transit_RoutesInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Transit_RoutesInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Vervoerroetes")
	return /** @type {LocalizedString} */ ("Transit routes")
});