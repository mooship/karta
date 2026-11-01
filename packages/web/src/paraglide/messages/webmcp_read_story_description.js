/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Read_Story_DescriptionInputs */



/**
* | output |
* | --- |
* | "Read this map's background story explaining why it exists, and open the Story panel." |
*
* @param {Webmcp_Read_Story_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_read_story_description = /** @type {((inputs?: Webmcp_Read_Story_DescriptionInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Read_Story_DescriptionInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Lees hierdie kaart se agtergrondverhaal wat verduidelik waarom dit bestaan, en open die Verhaal-paneel.")
	return /** @type {LocalizedString} */ ("Read this map's background story explaining why it exists, and open the Story panel.")
});