/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Gauteng_Spatial_Legacy_Story_TitleInputs */

const en_domain_gauteng_spatial_legacy_story_title = /** @type {(inputs: Domain_Gauteng_Spatial_Legacy_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Why this map exists`)
};

const st_domain_gauteng_spatial_legacy_story_title = /** @type {(inputs: Domain_Gauteng_Spatial_Legacy_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hobaneng 'mapa ona o le teng`)
};

const zu_domain_gauteng_spatial_legacy_story_title = /** @type {(inputs: Domain_Gauteng_Spatial_Legacy_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kungani leli balazwe likhona`)
};

const xh_domain_gauteng_spatial_legacy_story_title = /** @type {(inputs: Domain_Gauteng_Spatial_Legacy_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kutheni le mephu ikho`)
};

const af_domain_gauteng_spatial_legacy_story_title = /** @type {(inputs: Domain_Gauteng_Spatial_Legacy_Story_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Waarom hierdie kaart bestaan`)
};

/**
* | output |
* | --- |
* | "Why this map exists" |
*
* @param {Domain_Gauteng_Spatial_Legacy_Story_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_gauteng_spatial_legacy_story_title = /** @type {((inputs?: Domain_Gauteng_Spatial_Legacy_Story_TitleInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Gauteng_Spatial_Legacy_Story_TitleInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_domain_gauteng_spatial_legacy_story_title(inputs)
	if (locale === "zu") return zu_domain_gauteng_spatial_legacy_story_title(inputs)
	if (locale === "xh") return xh_domain_gauteng_spatial_legacy_story_title(inputs)
	if (locale === "af") return af_domain_gauteng_spatial_legacy_story_title(inputs)
	return en_domain_gauteng_spatial_legacy_story_title(inputs)
});