/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Heritage_Sites_Story_BodyInputs */

const en_domain_heritage_sites_story_body = /** @type {(inputs: Domain_Heritage_Sites_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apartheid tried to erase Black political life from the map. The places where people organised, worshipped, were detained, and were killed for resisting it are still here — this layer plots the ones that are publicly documented and open to visit today.`)
};

const st_domain_heritage_sites_story_body = /** @type {(inputs: Domain_Heritage_Sites_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kgethollo e ne e leka ho hlakola bophelo ba dipolotiki ba batho ba Batsho mapeng. Mafelo ao batho ba neng ba kopana ho ona, ba rapela, ba tshwarwa, mme ba bolawa ha ba hanyetsa yona, a sa le teng — sengoloa sena se bontsha ao a ngotsweng phatlalatsa mme a butswe ho etelwa kajeno.`)
};

const zu_domain_heritage_sites_story_body = /** @type {(inputs: Domain_Heritage_Sites_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ubandlululo lwazama ukususa impilo yezepolitiki yabantu abaMnyama ebalazweni. Izindawo lapho abantu babehlangana khona, bekhulekela, beboshiwe, futhi bebulawelwa ukumelana nalo, zisekhona — le ngqimba ikhombisa lezo ezibhalwe ngokusemthethweni futhi ezivulelekile ukuvakashelwa namuhla.`)
};

const xh_domain_heritage_sites_story_body = /** @type {(inputs: Domain_Heritage_Sites_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ucalucalulo lwalulinge ukucima ubomi bezopolitiko babantu abaMnyama emephini. Iindawo apho abantu babedibana khona, benqula, babanjwa, kwaye babulawa besilwa nalo, zisekhona — le ngqimba ibonisa ezo zibhalwe ngokusesikweni kwaye zivulelekile ukutyelelwa namhlanje.`)
};

const af_domain_heritage_sites_story_body = /** @type {(inputs: Domain_Heritage_Sites_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apartheid het probeer om Swart politieke lewe van die kaart te vee. Die plekke waar mense georganiseer, aanbid, aangehou is, en gesterf het terwyl hulle daarteen geveg het, is steeds hier — hierdie laag karteer dié wat openbaar gedokumenteer en vandag oop is om te besoek.`)
};

/**
* | output |
* | --- |
* | "Apartheid tried to erase Black political life from the map. The places where people organised, worshipped, were detained, and were killed for resisting it ar..." |
*
* @param {Domain_Heritage_Sites_Story_BodyInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_heritage_sites_story_body = /** @type {((inputs?: Domain_Heritage_Sites_Story_BodyInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Heritage_Sites_Story_BodyInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_domain_heritage_sites_story_body(inputs)
	if (locale === "zu") return zu_domain_heritage_sites_story_body(inputs)
	if (locale === "xh") return xh_domain_heritage_sites_story_body(inputs)
	if (locale === "af") return af_domain_heritage_sites_story_body(inputs)
	return en_domain_heritage_sites_story_body(inputs)
});