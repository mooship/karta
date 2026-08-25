/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Group_Transport_Costs_TitleInputs */

const en_layer_group_transport_costs_title = /** @type {(inputs: Layer_Group_Transport_Costs_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transport costs`)
};

const af_layer_group_transport_costs_title = /** @type {(inputs: Layer_Group_Transport_Costs_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vervoerkoste`)
};

/**
* | output |
* | --- |
* | "Transport costs" |
*
* @param {Layer_Group_Transport_Costs_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_group_transport_costs_title = /** @type {((inputs?: Layer_Group_Transport_Costs_TitleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Transport_Costs_TitleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_layer_group_transport_costs_title(inputs)
	return en_layer_group_transport_costs_title(inputs)
});