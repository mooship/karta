/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Group_Access_To_Opportunity_DescriptionInputs */

const en_layer_group_access_to_opportunity_description = /** @type {(inputs: Layer_Group_Access_To_Opportunity_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Only one overlay can be active at a time.`)
};

const st_layer_group_access_to_opportunity_description = /** @type {(inputs: Layer_Group_Access_To_Opportunity_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ke lera le le leng feela le ka sebetsang ka nako e le nngwe.`)
};

const zu_layer_group_access_to_opportunity_description = /** @type {(inputs: Layer_Group_Access_To_Opportunity_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yingqimba eyodwa kuphela engasebenza ngesikhathi esisodwa.`)
};

/**
* | output |
* | --- |
* | "Only one overlay can be active at a time." |
*
* @param {Layer_Group_Access_To_Opportunity_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const layer_group_access_to_opportunity_description = /** @type {((inputs?: Layer_Group_Access_To_Opportunity_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Access_To_Opportunity_DescriptionInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_group_access_to_opportunity_description(inputs)
	if (locale === "zu") return zu_layer_group_access_to_opportunity_description(inputs)
	return en_layer_group_access_to_opportunity_description(inputs)
});