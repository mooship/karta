/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Read_Story_DescriptionInputs */

const en_webmcp_read_story_description = /** @type {(inputs: Webmcp_Read_Story_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read this map's background story explaining why it exists, and open the Story panel.`)
};

const st_webmcp_read_story_description = /** @type {(inputs: Webmcp_Read_Story_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bala pale ea semelo ea 'mapa ona e hlalosang hore na o teng hobaneng, mme u bule phanele ea Pale.`)
};

const zu_webmcp_read_story_description = /** @type {(inputs: Webmcp_Read_Story_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Funda indaba engemuva yaleli balazwe echaza ukuthi likhona ngani, bese uvula iphaneli Yendaba.`)
};

const xh_webmcp_read_story_description = /** @type {(inputs: Webmcp_Read_Story_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Funda ibali elingasemva lale mephu elicacisa ukuba ikhoyo ngenxa yantoni, uze uvule iphaneli yeBali.`)
};

const af_webmcp_read_story_description = /** @type {(inputs: Webmcp_Read_Story_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lees hierdie kaart se agtergrondverhaal wat verduidelik waarom dit bestaan, en open die Verhaal-paneel.`)
};

/**
* | output |
* | --- |
* | "Read this map's background story explaining why it exists, and open the Story panel." |
*
* @param {Webmcp_Read_Story_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_read_story_description = /** @type {((inputs?: Webmcp_Read_Story_DescriptionInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Read_Story_DescriptionInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_read_story_description(inputs)
	if (locale === "zu") return zu_webmcp_read_story_description(inputs)
	if (locale === "xh") return xh_webmcp_read_story_description(inputs)
	if (locale === "af") return af_webmcp_read_story_description(inputs)
	return en_webmcp_read_story_description(inputs)
});