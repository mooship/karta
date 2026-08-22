/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} RetryInputs */

const en_retry = /** @type {(inputs: RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retry`)
};

const af_retry = /** @type {(inputs: RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Probeer weer`)
};

/**
* | output |
* | --- |
* | "Retry" |
*
* @param {RetryInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const retry = /** @type {((inputs?: RetryInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<RetryInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_retry(inputs)
	return en_retry(inputs)
});