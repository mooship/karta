/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Story_BodyInputs */

const en_domain_story_body = /** @type {(inputs: Domain_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apartheid law controlled where Black, Coloured and Indian people could live. Black townships were deliberately separated from economic centres, and those distances still shape access to work today. This map measures that gap with modelled car time and distance to transit.`)
};

const af_domain_story_body = /** @type {(inputs: Domain_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apartheidswetgewing het bepaal waar Swart, Kleurling- en Indiër-mense kon woon. Swart lokasies is doelbewus van ekonomiese sentrums geskei, en daardie afstande bepaal vandag steeds toegang tot werk. Hierdie kaart meet daardie gaping met gemodelleerde motortyd en afstand tot vervoer.`)
};

/**
* | output |
* | --- |
* | "Apartheid law controlled where Black, Coloured and Indian people could live. Black townships were deliberately separated from economic centres, and those dis..." |
*
* @param {Domain_Story_BodyInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_story_body = /** @type {((inputs?: Domain_Story_BodyInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Story_BodyInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_domain_story_body(inputs)
	return en_domain_story_body(inputs)
});