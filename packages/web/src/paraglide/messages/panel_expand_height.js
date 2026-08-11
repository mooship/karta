/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Expand_HeightInputs */

const en_panel_expand_height = /** @type {(inputs: Panel_Expand_HeightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expand panel height`)
};

/**
* | output |
* | --- |
* | "Expand panel height" |
*
* @param {Panel_Expand_HeightInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const panel_expand_height = /** @type {((inputs?: Panel_Expand_HeightInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Expand_HeightInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_panel_expand_height(inputs)
});