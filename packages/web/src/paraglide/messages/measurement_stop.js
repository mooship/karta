/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_StopInputs */

const en_measurement_stop = /** @type {(inputs: Measurement_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop measuring`)
};

const af_measurement_stop = /** @type {(inputs: Measurement_StopInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop met meet`)
};

/**
* | output |
* | --- |
* | "Stop measuring" |
*
* @param {Measurement_StopInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_stop = /** @type {((inputs?: Measurement_StopInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_StopInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_measurement_stop(inputs)
	return en_measurement_stop(inputs)
});