/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Reduce_HeightInputs */

const en_panel_reduce_height = /** @type {(inputs: Panel_Reduce_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reduce panel height`)
};

/**
* | output |
* | --- |
* | "Reduce panel height" |
*
* @param {Panel_Reduce_HeightInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const panel_reduce_height = /** @type {((inputs?: Panel_Reduce_HeightInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Reduce_HeightInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_panel_reduce_height(inputs)
});