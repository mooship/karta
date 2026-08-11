/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Meta_DescriptionInputs */

const en_meta_description = /** @type {(inputs: Meta_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Visualising how apartheid-era spatial planning still shapes commute times and access to jobs in Tshwane and Johannesburg.`)
};

/**
* | output |
* | --- |
* | "Visualising how apartheid-era spatial planning still shapes commute times and access to jobs in Tshwane and Johannesburg." |
*
* @param {Meta_DescriptionInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const meta_description = /** @type {((inputs?: Meta_DescriptionInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Meta_DescriptionInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_meta_description(inputs)
});