/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ hours: NonNullable<unknown>, minutes: NonNullable<unknown> }} Commute_Hours_MinutesInputs */

const en_commute_hours_minutes = /** @type {(inputs: Commute_Hours_MinutesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.hours}h ${i?.minutes}min`)
};

/**
* | output |
* | --- |
* | "{hours}h {minutes}min" |
*
* @param {Commute_Hours_MinutesInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const commute_hours_minutes = /** @type {((inputs: Commute_Hours_MinutesInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_Hours_MinutesInputs, { locale?: "en" }, {}>} */ ((inputs, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_commute_hours_minutes(inputs)
});