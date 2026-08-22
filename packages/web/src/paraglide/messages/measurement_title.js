/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Measurement_TitleInputs */

const en_measurement_title = /** @type {(inputs: Measurement_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Measure`)
};

const af_measurement_title = /** @type {(inputs: Measurement_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Meet`)
};

/**
* | output |
* | --- |
* | "Measure" |
*
* @param {Measurement_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const measurement_title = /** @type {((inputs?: Measurement_TitleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_TitleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_measurement_title(inputs)
	return en_measurement_title(inputs)
});