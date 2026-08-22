/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_HeadingInputs */

const en_app_heading = /** @type {(inputs: App_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karta: Gauteng spatial legacy map`)
};

const af_app_heading = /** @type {(inputs: App_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karta: Gauteng se ruimtelike erfeniskaart`)
};

/**
* | output |
* | --- |
* | "Karta: Gauteng spatial legacy map" |
*
* @param {App_HeadingInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const app_heading = /** @type {((inputs?: App_HeadingInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_HeadingInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_app_heading(inputs)
	return en_app_heading(inputs)
});