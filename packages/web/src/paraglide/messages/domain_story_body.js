/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Story_BodyInputs */



/**
* | output |
* | --- |
* | "South Africa's Group Areas Act (1950) segregated where people could live and used distance as policy. Black, Coloured and Indian communities were forcibly re..." |
*
* @param {Domain_Story_BodyInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_story_body = /** @type {((inputs?: Domain_Story_BodyInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Story_BodyInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ ("Suid-Afrika se Groepsgebiedewet (1950) het gesegregeer waar mense kon woon en afstand as beleid gebruik. Swart, Kleurling- en Indiër-gemeenskappe is gedwonge verwyder van grond naby stadsentrums en op die stedelike buiterand hervestig, dikwels agter bufferstroke van snelweë, nywerheidsonering of onbeboude grond, ver van die werk en dienste in daardie sentrums. Apartheid se wette het in 1994 geëindig, maar die lokasies wat op die buiterand gebou is, is steeds daar. Hierdie kaart wys gemodelleerde motortyd na groot werksentrums, reguitlynafstand na die naaste formele vervoerroete, en 'n gekombineerde telling vir gebiede waar albei hoog is.")
	return /** @type {LocalizedString} */ ("South Africa's Group Areas Act (1950) segregated where people could live and used distance as policy. Black, Coloured and Indian communities were forcibly removed from land near city centres and resettled on the urban periphery, often behind buffer strips of highway, industrial zoning or vacant land, far from the jobs and services in those centres. Apartheid's laws ended in 1994, but the townships built on the periphery are still there. This map shows modelled car time to major job centres, straight-line distance to the nearest formal transit route, and a combined score for areas where both are high.")
});