/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Commute_No_DataInputs */

const en_commute_no_data = /** @type {(inputs: Commute_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No data`)
};

const st_commute_no_data = /** @type {(inputs: Commute_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ha ho boitsebiso`)
};

const zu_commute_no_data = /** @type {(inputs: Commute_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Alukho ulwazi`)
};

const xh_commute_no_data = /** @type {(inputs: Commute_No_DataInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Akukho lwazi`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const commute_no_data = /** @type {((inputs?: Commute_No_DataInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_No_DataInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_commute_no_data(inputs)
	if (locale === "zu") return zu_commute_no_data(inputs)
	if (locale === "xh") return xh_commute_no_data(inputs)
	if (locale === "af") return af_commute_no_data(inputs)
	return en_commute_no_data(inputs)
});