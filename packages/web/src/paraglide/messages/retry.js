/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} RetryInputs */

const en_retry = /** @type {(inputs: RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retry`)
};

const st_retry = /** @type {(inputs: RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leka hape`)
};

const zu_retry = /** @type {(inputs: RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zama futhi`)
};

/**
* | output |
* | --- |
* | "Retry" |
*
* @param {RetryInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const retry = /** @type {((inputs?: RetryInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<RetryInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_retry(inputs)
	if (locale === "zu") return zu_retry(inputs)
	return en_retry(inputs)
});