/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Browse_Empty_MessageInputs */

const en_browse_empty_message = /** @type {(inputs: Browse_Empty_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No matches found`)
};

const st_browse_empty_message = /** @type {(inputs: Browse_Empty_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ha ho diphetho tse fumanweng`)
};

const zu_browse_empty_message = /** @type {(inputs: Browse_Empty_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awekho imiphumela etholakele`)
};

const xh_browse_empty_message = /** @type {(inputs: Browse_Empty_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Akukho miphumela ifunyenweyo`)
};

const af_browse_empty_message = /** @type {(inputs: Browse_Empty_MessageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geen resultate gevind nie`)
};

/**
* | output |
* | --- |
* | "No matches found" |
*
* @param {Browse_Empty_MessageInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const browse_empty_message = /** @type {((inputs?: Browse_Empty_MessageInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Browse_Empty_MessageInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_browse_empty_message(inputs)
	if (locale === "zu") return zu_browse_empty_message(inputs)
	if (locale === "xh") return xh_browse_empty_message(inputs)
	if (locale === "af") return af_browse_empty_message(inputs)
	return en_browse_empty_message(inputs)
});