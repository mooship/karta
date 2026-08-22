/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_Transit_RoutesInputs */

const en_legend_transit_routes = /** @type {(inputs: Legend_Transit_RoutesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transit routes`)
};

const af_legend_transit_routes = /** @type {(inputs: Legend_Transit_RoutesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vervoerroetes`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_legend_transit_routes(inputs)
	return en_legend_transit_routes(inputs)
});