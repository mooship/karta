/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} App_TitleInputs */

const en_app_title = /** @type {(inputs: App_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karta`)
};

const st_app_title = /** @type {(inputs: App_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karta`)
};

const zu_app_title = /** @type {(inputs: App_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Karta`)
};

/**
* | output |
* | --- |
* | "Karta" |
*
* @param {App_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const app_title = /** @type {((inputs?: App_TitleInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<App_TitleInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_app_title(inputs)
	if (locale === "zu") return zu_app_title(inputs)
	return en_app_title(inputs)
});