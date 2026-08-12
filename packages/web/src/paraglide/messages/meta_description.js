/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Meta_DescriptionInputs */

const en_meta_description = /** @type {(inputs: Meta_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Visualising how apartheid-era spatial planning still shapes commute times and access to jobs across Gauteng.`)
};

const st_meta_description = /** @type {(inputs: Meta_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E bontsha kamoo meralo ya sebaka mehleng ya kgethollo e ntseng e hlwaya nako ya maeto le phihlello ya mesebetsi ho Gauteng.`)
};

const zu_meta_description = /** @type {(inputs: Meta_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibonisa indlela ukuhlelwa kwezindawo ngesikhathi sobandlululo okusalokhu kubumba ngayo isikhathi sokuya emsebenzini nokufinyelela emsebenzini eGauteng.`)
};

const xh_meta_description = /** @type {(inputs: Meta_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibonisa indlela ucwangciso lweendawo ngexesha localucalulo olusabumba ngayo ixesha lokuya emsebenzini nokufikelela emsebenzini eGauteng.`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const meta_description = /** @type {((inputs?: Meta_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Meta_DescriptionInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_meta_description(inputs)
	if (locale === "zu") return zu_meta_description(inputs)
	if (locale === "xh") return xh_meta_description(inputs)
	if (locale === "af") return af_meta_description(inputs)
	return en_meta_description(inputs)
});