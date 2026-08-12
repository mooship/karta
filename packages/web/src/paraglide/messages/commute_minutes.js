/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ minutes: NonNullable<unknown> }} Commute_MinutesInputs */

const en_commute_minutes = /** @type {(inputs: Commute_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.minutes} min`)
};

const st_commute_minutes = /** @type {(inputs: Commute_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.minutes} min`)
};

const zu_commute_minutes = /** @type {(inputs: Commute_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.minutes} min`)
};

/**
* | output |
* | --- |
* | "{minutes} min" |
*
* @param {Commute_MinutesInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const commute_minutes = /** @type {((inputs: Commute_MinutesInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_MinutesInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_commute_minutes(inputs)
	if (locale === "zu") return zu_commute_minutes(inputs)
	return en_commute_minutes(inputs)
});