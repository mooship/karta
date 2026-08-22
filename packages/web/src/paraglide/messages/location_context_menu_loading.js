/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Location_Context_Menu_LoadingInputs */

const en_location_context_menu_loading = /** @type {(inputs: Location_Context_Menu_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Looking up address…`)
};

const af_location_context_menu_loading = /** @type {(inputs: Location_Context_Menu_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Soek adres...`)
};

/**
* | output |
* | --- |
* | "Looking up address…" |
*
* @param {Location_Context_Menu_LoadingInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const location_context_menu_loading = /** @type {((inputs?: Location_Context_Menu_LoadingInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_LoadingInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_location_context_menu_loading(inputs)
	return en_location_context_menu_loading(inputs)
});