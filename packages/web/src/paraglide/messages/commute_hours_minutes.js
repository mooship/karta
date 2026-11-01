/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hours: NonNullable<unknown>, minutes: NonNullable<unknown> }} Commute_Hours_MinutesInputs */



/**
* | output |
* | --- |
* | "{hours}h {minutes}min" |
*
* @param {Commute_Hours_MinutesInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const commute_hours_minutes = /** @type {((inputs: Commute_Hours_MinutesInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_Hours_MinutesInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`${i?.hours}h ${i?.minutes}min`)
	return /** @type {LocalizedString} */ (`${i?.hours}h ${i?.minutes}min`)
});