/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commute_No_DataInputs */

const en_commute_no_data = /** @type {(inputs: Commute_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No data`)
};

/**
* | output |
* | --- |
* | "No data" |
*
* @param {Commute_No_DataInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const commute_no_data = /** @type {((inputs?: Commute_No_DataInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_No_DataInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_commute_no_data(inputs)
});