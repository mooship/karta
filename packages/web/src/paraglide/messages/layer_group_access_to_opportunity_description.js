/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Group_Access_To_Opportunity_DescriptionInputs */



/**
* | output |
* | --- |
* | "Only one overlay can be active at a time." |
*
* @param {Layer_Group_Access_To_Opportunity_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_group_access_to_opportunity_description = /** @type {((inputs?: Layer_Group_Access_To_Opportunity_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Access_To_Opportunity_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Slegs een laag kan op 'n slag aktief wees.")
	return /** @type {LocalizedString} */ ("Only one overlay can be active at a time.")
});