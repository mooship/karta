/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Group_Access_To_Opportunity_TitleInputs */

const en_layer_group_access_to_opportunity_title = /** @type {(inputs: Layer_Group_Access_To_Opportunity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accessibility overlays`)
};

const st_layer_group_access_to_opportunity_title = /** @type {(inputs: Layer_Group_Access_To_Opportunity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maera a phihlello`)
};

const zu_layer_group_access_to_opportunity_title = /** @type {(inputs: Layer_Group_Access_To_Opportunity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Izingqimba zokufinyelela`)
};

const xh_layer_group_access_to_opportunity_title = /** @type {(inputs: Layer_Group_Access_To_Opportunity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iingqimba zokufikelela`)
};

/**
* | output |
* | --- |
* | "Accessibility overlays" |
*
* @param {Layer_Group_Access_To_Opportunity_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const layer_group_access_to_opportunity_title = /** @type {((inputs?: Layer_Group_Access_To_Opportunity_TitleInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Access_To_Opportunity_TitleInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_group_access_to_opportunity_title(inputs)
	if (locale === "zu") return zu_layer_group_access_to_opportunity_title(inputs)
	if (locale === "xh") return xh_layer_group_access_to_opportunity_title(inputs)
	return en_layer_group_access_to_opportunity_title(inputs)
});