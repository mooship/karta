/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ minutes: NonNullable<unknown> }} Commute_MinutesInputs */

const en_commute_minutes = /** @type {(inputs: Commute_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.minutes} min`)
};

const af_commute_minutes = /** @type {(inputs: Commute_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.minutes} min`)
};

/**
* | output |
* | --- |
* | "{minutes} min" |
*
* @param {Commute_MinutesInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const commute_minutes = /** @type {((inputs: Commute_MinutesInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_MinutesInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_commute_minutes(inputs)
	return en_commute_minutes(inputs)
});