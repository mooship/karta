/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Group_Heritage_TitleInputs */

const en_layer_group_heritage_title = /** @type {(inputs: Layer_Group_Heritage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Heritage`)
};

const st_layer_group_heritage_title = /** @type {(inputs: Layer_Group_Heritage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bohwa`)
};

const zu_layer_group_heritage_title = /** @type {(inputs: Layer_Group_Heritage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ifa`)
};

const xh_layer_group_heritage_title = /** @type {(inputs: Layer_Group_Heritage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ilifa`)
};

const af_layer_group_heritage_title = /** @type {(inputs: Layer_Group_Heritage_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erfenis`)
};

/**
* | output |
* | --- |
* | "Heritage" |
*
* @param {Layer_Group_Heritage_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_group_heritage_title = /** @type {((inputs?: Layer_Group_Heritage_TitleInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Group_Heritage_TitleInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_group_heritage_title(inputs)
	if (locale === "zu") return zu_layer_group_heritage_title(inputs)
	if (locale === "xh") return xh_layer_group_heritage_title(inputs)
	if (locale === "af") return af_layer_group_heritage_title(inputs)
	return en_layer_group_heritage_title(inputs)
});