/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Story_TitleInputs */

const en_domain_story_title = /** @type {(inputs: Domain_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Why this map exists`)
};

const af_domain_story_title = /** @type {(inputs: Domain_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waarom hierdie kaart bestaan`)
};

/**
* | output |
* | --- |
* | "Why this map exists" |
*
* @param {Domain_Story_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_story_title = /** @type {((inputs?: Domain_Story_TitleInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Story_TitleInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_domain_story_title(inputs)
	return en_domain_story_title(inputs)
});