/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hours: NonNullable<unknown>, minutes: NonNullable<unknown> }} Commute_Hours_MinutesInputs */

const en_commute_hours_minutes = /** @type {(inputs: Commute_Hours_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours}h ${i?.minutes}min`)
};

const st_commute_hours_minutes = /** @type {(inputs: Commute_Hours_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours}h ${i?.minutes}min`)
};

const zu_commute_hours_minutes = /** @type {(inputs: Commute_Hours_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours}h ${i?.minutes}min`)
};

const xh_commute_hours_minutes = /** @type {(inputs: Commute_Hours_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours}h ${i?.minutes}min`)
};

/**
* | output |
* | --- |
* | "{hours}h {minutes}min" |
*
* @param {Commute_Hours_MinutesInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const commute_hours_minutes = /** @type {((inputs: Commute_Hours_MinutesInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_Hours_MinutesInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_commute_hours_minutes(inputs)
	if (locale === "zu") return zu_commute_hours_minutes(inputs)
	if (locale === "xh") return xh_commute_hours_minutes(inputs)
	return en_commute_hours_minutes(inputs)
});