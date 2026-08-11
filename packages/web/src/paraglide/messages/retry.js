/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} RetryInputs */

const en_retry = /** @type {(inputs: RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retry`)
};

/**
* | output |
* | --- |
* | "Retry" |
*
* @param {RetryInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const retry = /** @type {((inputs?: RetryInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<RetryInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_retry(inputs)
});