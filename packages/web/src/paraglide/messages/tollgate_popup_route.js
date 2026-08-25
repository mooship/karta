/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Tollgate_Popup_RouteInputs */

const en_tollgate_popup_route = /** @type {(inputs: Tollgate_Popup_RouteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Route`)
};

const af_tollgate_popup_route = /** @type {(inputs: Tollgate_Popup_RouteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Roete`)
};

/**
* | output |
* | --- |
* | "Route" |
*
* @param {Tollgate_Popup_RouteInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const tollgate_popup_route = /** @type {((inputs?: Tollgate_Popup_RouteInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Tollgate_Popup_RouteInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_tollgate_popup_route(inputs)
	return en_tollgate_popup_route(inputs)
});