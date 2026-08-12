/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Story_TitleInputs */

const en_domain_story_title = /** @type {(inputs: Domain_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Why this map exists`)
};

const st_domain_story_title = /** @type {(inputs: Domain_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hobaneng 'mapa ona o le teng`)
};

const zu_domain_story_title = /** @type {(inputs: Domain_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kungani leli balazwe likhona`)
};

const xh_domain_story_title = /** @type {(inputs: Domain_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kutheni le mephu ikho`)
};

/**
* | output |
* | --- |
* | "Why this map exists" |
*
* @param {Domain_Story_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export const domain_story_title = /** @type {((inputs?: Domain_Story_TitleInputs, options?: { locale?: "en" | "st" | "zu" | "xh" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Story_TitleInputs, { locale?: "en" | "st" | "zu" | "xh" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_domain_story_title(inputs)
	if (locale === "zu") return zu_domain_story_title(inputs)
	if (locale === "xh") return xh_domain_story_title(inputs)
	return en_domain_story_title(inputs)
});