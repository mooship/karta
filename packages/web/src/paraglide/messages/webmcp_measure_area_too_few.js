/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Webmcp_Measure_Area_Too_FewInputs */

const en_webmcp_measure_area_too_few = /** @type {(inputs: Webmcp_Measure_Area_Too_FewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provide at least three locations to measure an area.`)
};

const st_webmcp_measure_area_too_few = /** @type {(inputs: Webmcp_Measure_Area_Too_FewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fana ka bonyane libaka tse tharo ho lekanya sebaka.`)
};

const zu_webmcp_measure_area_too_few = /** @type {(inputs: Webmcp_Measure_Area_Too_FewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nikeza okungenani izindawo ezintathu ukuze ukale indawo.`)
};

const xh_webmcp_measure_area_too_few = /** @type {(inputs: Webmcp_Measure_Area_Too_FewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nikela ubuncinane iindawo ezintathu ukulinganisa indawo.`)
};

const af_webmcp_measure_area_too_few = /** @type {(inputs: Webmcp_Measure_Area_Too_FewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verskaf ten minste drie plekke om 'n area te meet.`)
};

/**
* | output |
* | --- |
* | "Provide at least three locations to measure an area." |
*
* @param {Webmcp_Measure_Area_Too_FewInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_measure_area_too_few = /** @type {((inputs?: Webmcp_Measure_Area_Too_FewInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Measure_Area_Too_FewInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_measure_area_too_few(inputs)
	if (locale === "zu") return zu_webmcp_measure_area_too_few(inputs)
	if (locale === "xh") return xh_webmcp_measure_area_too_few(inputs)
	if (locale === "af") return af_webmcp_measure_area_too_few(inputs)
	return en_webmcp_measure_area_too_few(inputs)
});