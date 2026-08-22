/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Group_Access_To_Opportunity_TitleInputs */

const en_layer_group_access_to_opportunity_title = /** @type {(inputs: Layer_Group_Access_To_Opportunity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accessibility overlays`)
};

const af_layer_group_access_to_opportunity_title = /** @type {(inputs: Layer_Group_Access_To_Opportunity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toeganklikheidslae`)
};

/**
* | output |
* | --- |
* | "Accessibility overlays" |
*
* @param {Layer_Group_Access_To_Opportunity_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_group_access_to_opportunity_title = /** @type {((inputs?: Layer_Group_Access_To_Opportunity_TitleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Access_To_Opportunity_TitleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_group_access_to_opportunity_title(inputs)
	return en_layer_group_access_to_opportunity_title(inputs)
});