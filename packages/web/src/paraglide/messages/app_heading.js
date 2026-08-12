/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_HeadingInputs */

const en_app_heading = /** @type {(inputs: App_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karta: Gauteng spatial legacy map`)
};

const st_app_heading = /** @type {(inputs: App_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karta: 'Mapa wa lefa la sebaka sa Gauteng`)
};

const zu_app_heading = /** @type {(inputs: App_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karta: Ibalazwe lefa lokuhlelwa kwezindawo eGauteng`)
};

/**
* | output |
* | --- |
* | "Karta: Gauteng spatial legacy map" |
*
* @param {App_HeadingInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const app_heading = /** @type {((inputs?: App_HeadingInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_HeadingInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_app_heading(inputs)
	if (locale === "zu") return zu_app_heading(inputs)
	return en_app_heading(inputs)
});