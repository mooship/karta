/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Heritage_Sites_Story_TitleInputs */

const en_domain_heritage_sites_story_title = /** @type {(inputs: Domain_Heritage_Sites_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Why these sites matter`)
};

const st_domain_heritage_sites_story_title = /** @type {(inputs: Domain_Heritage_Sites_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hobaneng mafelo ana a le bohlokwa`)
};

const zu_domain_heritage_sites_story_title = /** @type {(inputs: Domain_Heritage_Sites_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kungani lezi zindawo zibalulekile`)
};

const xh_domain_heritage_sites_story_title = /** @type {(inputs: Domain_Heritage_Sites_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kutheni ezi ndawo zibalulekile`)
};

const af_domain_heritage_sites_story_title = /** @type {(inputs: Domain_Heritage_Sites_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waarom hierdie plekke saak maak`)
};

/**
* | output |
* | --- |
* | "Why these sites matter" |
*
* @param {Domain_Heritage_Sites_Story_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_heritage_sites_story_title = /** @type {((inputs?: Domain_Heritage_Sites_Story_TitleInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Heritage_Sites_Story_TitleInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_domain_heritage_sites_story_title(inputs)
	if (locale === "zu") return zu_domain_heritage_sites_story_title(inputs)
	if (locale === "xh") return xh_domain_heritage_sites_story_title(inputs)
	if (locale === "af") return af_domain_heritage_sites_story_title(inputs)
	return en_domain_heritage_sites_story_title(inputs)
});