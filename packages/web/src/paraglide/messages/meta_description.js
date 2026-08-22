/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Meta_DescriptionInputs */

const en_meta_description = /** @type {(inputs: Meta_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Visualising how apartheid-era spatial planning still shapes commute times and access to jobs across Gauteng.`)
};

const af_meta_description = /** @type {(inputs: Meta_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wys hoe ruimtelike beplanning uit die apartheidsera steeds reistye en toegang tot werk regoor Gauteng bepaal.`)
};

/**
* | output |
* | --- |
* | "Visualising how apartheid-era spatial planning still shapes commute times and access to jobs across Gauteng." |
*
* @param {Meta_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const meta_description = /** @type {((inputs?: Meta_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Meta_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_meta_description(inputs)
	return en_meta_description(inputs)
});