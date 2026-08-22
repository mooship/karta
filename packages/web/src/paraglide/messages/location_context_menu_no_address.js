/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Location_Context_Menu_No_AddressInputs */

const en_location_context_menu_no_address = /** @type {(inputs: Location_Context_Menu_No_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No address found here.`)
};

const af_location_context_menu_no_address = /** @type {(inputs: Location_Context_Menu_No_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geen adres hier gevind nie.`)
};

/**
* | output |
* | --- |
* | "No address found here." |
*
* @param {Location_Context_Menu_No_AddressInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const location_context_menu_no_address = /** @type {((inputs?: Location_Context_Menu_No_AddressInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_No_AddressInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_location_context_menu_no_address(inputs)
	return en_location_context_menu_no_address(inputs)
});