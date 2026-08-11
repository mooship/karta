/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Failed_BadgeInputs */

const en_layer_failed_badge = /** @type {(inputs: Layer_Failed_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Failed to load — toggle off and on to retry`)
};

/**
* | output |
* | --- |
* | "Failed to load — toggle off and on to retry" |
*
* @param {Layer_Failed_BadgeInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const layer_failed_badge = /** @type {((inputs?: Layer_Failed_BadgeInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Failed_BadgeInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_layer_failed_badge(inputs)
});