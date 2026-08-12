/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Group_Transit_Networks_TitleInputs */

const en_layer_group_transit_networks_title = /** @type {(inputs: Layer_Group_Transit_Networks_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transit networks`)
};

const st_layer_group_transit_networks_title = /** @type {(inputs: Layer_Group_Transit_Networks_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marangrang a dipalangwa`)
};

const zu_layer_group_transit_networks_title = /** @type {(inputs: Layer_Group_Transit_Networks_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amanethiwekhi ezokuthutha`)
};

const xh_layer_group_transit_networks_title = /** @type {(inputs: Layer_Group_Transit_Networks_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amanethiwekhi ezokuthutha`)
};

/**
* | output |
* | --- |
* | "Transit networks" |
*
* @param {Layer_Group_Transit_Networks_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const layer_group_transit_networks_title = /** @type {((inputs?: Layer_Group_Transit_Networks_TitleInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Transit_Networks_TitleInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_group_transit_networks_title(inputs)
	if (locale === "zu") return zu_layer_group_transit_networks_title(inputs)
	if (locale === "xh") return xh_layer_group_transit_networks_title(inputs)
	return en_layer_group_transit_networks_title(inputs)
});