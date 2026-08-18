/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Layer_Heritage_Sites_DescriptionInputs */

const en_layer_heritage_sites_description = /** @type {(inputs: Layer_Heritage_Sites_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Approximate locations of publicly documented sites significant to South Africa's anti-apartheid and democracy history.`)
};

const st_layer_heritage_sites_description = /** @type {(inputs: Layer_Heritage_Sites_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dibaka tse akantsweng tsa mafelo a ngotsweng phatlalatsa a bohlokwa historing ya kgahlanong le kgethollo le temokrasi ya Afrika Borwa.`)
};

const zu_layer_heritage_sites_description = /** @type {(inputs: Layer_Heritage_Sites_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Izindawo ezilinganiselwe zezindawo ezibhalwe ngokusemthethweni ezibalulekile emlandweni wokulwa nobandlululo nowentando yeningi eNingizimu Afrika.`)
};

const xh_layer_heritage_sites_description = /** @type {(inputs: Layer_Heritage_Sites_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iindawo eziqikelelwayo zeendawo ezibhalwe ngokusesikweni ezibaluleke kwimbali yokulwa nocalucalulo nentsebenzo-ntando yesizwe eMzantsi Afrika.`)
};

const af_layer_heritage_sites_description = /** @type {(inputs: Layer_Heritage_Sites_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Benaderde liggings van openbaar gedokumenteerde plekke wat belangrik is vir Suid-Afrika se anti-apartheid- en demokrasiegeskiedenis.`)
};

/**
* | output |
* | --- |
* | "Approximate locations of publicly documented sites significant to South Africa's anti-apartheid and democracy history." |
*
* @param {Layer_Heritage_Sites_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const layer_heritage_sites_description = /** @type {((inputs?: Layer_Heritage_Sites_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Heritage_Sites_DescriptionInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_layer_heritage_sites_description(inputs)
	if (locale === "zu") return zu_layer_heritage_sites_description(inputs)
	if (locale === "xh") return xh_layer_heritage_sites_description(inputs)
	if (locale === "af") return af_layer_heritage_sites_description(inputs)
	return en_layer_heritage_sites_description(inputs)
});