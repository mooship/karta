/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loading_MapInputs */

const en_loading_map = /** @type {(inputs: Loading_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading map`)
};

const af_loading_map = /** @type {(inputs: Loading_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kaart laai tans`)
};

/**
* | output |
* | --- |
* | "Loading map" |
*
* @param {Loading_MapInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const loading_map = /** @type {((inputs?: Loading_MapInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loading_MapInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_loading_map(inputs)
	return en_loading_map(inputs)
});