/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Story_BodyInputs */

const en_domain_story_body = /** @type {(inputs: Domain_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`South Africa's Group Areas Act (1950) didn't just segregate where people could live — it engineered distance as policy. Black, Coloured and Indian communities were forcibly removed from land near city centres and resettled on the urban periphery, often behind deliberate buffer strips of highway, industrial zoning, or vacant land, placing them furthest from the jobs and services those centres offered. That geography did not end with apartheid's laws in 1994: townships built as peripheries are still peripheries today. This map measures three parts of that legacy — modelled car time to major job centres, straight-line distance to the nearest formal transit route, and a combined score showing where both burdens compound — to make a policy decision's lasting shape visible, not just remembered.`)
};

const af_domain_story_body = /** @type {(inputs: Domain_Story_BodyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suid-Afrika se Groepsgebiedewet (1950) het nie net gesegregeer waar mense kon woon nie — dit het afstand as beleid ontwerp. Swart, Kleurling- en Indiër-gemeenskappe is gedwonge verwyder van grond naby stadsentrums en op die stedelike buiterand hervestig, dikwels agter doelbewuste bufferstroke van snelweë, nywerheidsonering, of onbeboude grond, wat hulle die verste van die werk en dienste wat daardie sentrums gebied het, geplaas het. Daardie geografie het nie saam met apartheid se wette in 1994 geëindig nie: lokasies wat as buiterande gebou is, is vandag steeds buiterande. Hierdie kaart meet drie dele van daardie nalatenskap — gemodelleerde motortyd na groot werksentrums, reguitlynafstand na die naaste formele vervoerroete, en 'n gekombineerde telling wat wys waar albei laste saamval — om die blywende vorm van 'n beleidsbesluit sigbaar te maak, nie net onthou nie.`)
};

/**
* | output |
* | --- |
* | "South Africa's Group Areas Act (1950) didn't just segregate where people could live — it engineered distance as policy. Black, Coloured and Indian communitie..." |
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