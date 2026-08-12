/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Loading_MapInputs */

const en_loading_map = /** @type {(inputs: Loading_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Loading map`)
};

const st_loading_map = /** @type {(inputs: Loading_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`'Mapa o ntse o kenngwa`)
};

const zu_loading_map = /** @type {(inputs: Loading_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibalazwe liyalayisha`)
};

const xh_loading_map = /** @type {(inputs: Loading_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Imephu iyalayisha`)
};

const af_loading_map = /** @type {(inputs: Loading_MapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kaart laai tans`)
};

/**
* | output |
* | --- |
* | "Loading map" |
*
* @param {Loading_MapInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const loading_map = /** @type {((inputs?: Loading_MapInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Loading_MapInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_loading_map(inputs)
	if (locale === "zu") return zu_loading_map(inputs)
	if (locale === "xh") return xh_loading_map(inputs)
	if (locale === "af") return af_loading_map(inputs)
	return en_loading_map(inputs)
});