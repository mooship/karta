/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loading_MapInputs */

const en_loading_map = /** @type {(inputs: Loading_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading map`)
};

/**
* | output |
* | --- |
* | "Loading map" |
*
* @param {Loading_MapInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const loading_map = /** @type {((inputs?: Loading_MapInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loading_MapInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_loading_map(inputs)
});