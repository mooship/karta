/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_HintInputs */



/**
* | output |
* | --- |
* | "Click the map to start measuring." |
*
* @param {Measurement_HintInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_hint = /** @type {((inputs?: Measurement_HintInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_HintInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Klik op die kaart om te begin meet.")
	return /** @type {LocalizedString} */ ("Click the map to start measuring.")
});