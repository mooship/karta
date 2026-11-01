/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Group_Transit_Networks_TitleInputs */



/**
* | output |
* | --- |
* | "Transit networks" |
*
* @param {Layer_Group_Transit_Networks_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_group_transit_networks_title = /** @type {((inputs?: Layer_Group_Transit_Networks_TitleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Transit_Networks_TitleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Vervoernetwerke")
	return /** @type {LocalizedString} */ ("Transit networks")
});