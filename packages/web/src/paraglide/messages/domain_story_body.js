/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Story_BodyInputs */

const en_domain_story_body = /** @type {(inputs: Domain_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apartheid law controlled where Black, Coloured and Indian people could live. Black townships were deliberately separated from economic centres, and those distances still shape access to work today. This map measures that gap with modelled car time and distance to transit.`)
};

const st_domain_story_body = /** @type {(inputs: Domain_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Molao wa kgethollo o ne o laola moo batho ba Batsho, ba Bammala le ba Maindia ba neng ba ka phela teng. Metse a Batho ba Batsho a ne a arohantswe ka boomo le ditsi tsa moruo, mme dibaka tseo di sa bontsha phihlello ya mesebetsi kajeno. 'Mapa ona o lekanya lekgalo leo ka nako ya koloi e akantsweng le bohole ho isa dipalangwaneng.`)
};

const zu_domain_story_body = /** @type {(inputs: Domain_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umthetho wobandlululo wawulawula ukuthi abantu abaMnyama, amaKhaladi kanye namaNdiya bangahlala kuphi. Amalokishi abantu abaMnyama ehlukaniswa ngamabomu nezikhungo zomnotho, futhi lawo mabanga asabumba ukufinyelela emsebenzini nanamuhla. Leli balazwe likala lelo gebe ngesikhathi semoto esilinganiselwe nebanga eliya ezokuthutha.`)
};

const xh_domain_story_body = /** @type {(inputs: Domain_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umthetho wocalucalulo wawulawula ukuba abantu abaMnyama, amaKhaladi kunye namaNdiya bangahlala kuphi. Amalokishi abantu abaMnyama ahlukaniswa ngabom kwizikhungo zoqoqosho, kwaye loo mabanga asabumba ukufikelela emsebenzini nanamhlanje. Le mephu ilinganisa loo msantsa ngexesha lemoto elilinganiselweyo nangomgama oya kwezokuthutha.`)
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
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_story_body = /** @type {((inputs?: Domain_Story_BodyInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Story_BodyInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_domain_story_body(inputs)
	if (locale === "zu") return zu_domain_story_body(inputs)
	if (locale === "xh") return xh_domain_story_body(inputs)
	if (locale === "af") return af_domain_story_body(inputs)
	return en_domain_story_body(inputs)
});