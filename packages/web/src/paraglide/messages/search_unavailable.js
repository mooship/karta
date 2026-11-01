/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Search_UnavailableInputs */



/**
* | output |
* | --- |
* | "Search is unavailable right now. Please try again." |
*
* @param {Search_UnavailableInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const search_unavailable = /** @type {((inputs?: Search_UnavailableInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_UnavailableInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Soek is tans nie beskikbaar nie. Probeer asseblief weer.")
	return /** @type {LocalizedString} */ ("Search is unavailable right now. Please try again.")
});