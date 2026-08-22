/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commute_No_DataInputs */

const en_commute_no_data = /** @type {(inputs: Commute_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No data`)
};

const af_commute_no_data = /** @type {(inputs: Commute_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geen data`)
};

/**
* | output |
* | --- |
* | "No data" |
*
* @param {Commute_No_DataInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const commute_no_data = /** @type {((inputs?: Commute_No_DataInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_No_DataInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_commute_no_data(inputs)
	return en_commute_no_data(inputs)
});