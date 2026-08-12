/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tab_StoryInputs */

const en_panel_tab_story = /** @type {(inputs: Panel_Tab_StoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Story`)
};

const st_panel_tab_story = /** @type {(inputs: Panel_Tab_StoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pale`)
};

const zu_panel_tab_story = /** @type {(inputs: Panel_Tab_StoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indaba`)
};

const xh_panel_tab_story = /** @type {(inputs: Panel_Tab_StoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ibali`)
};

const af_panel_tab_story = /** @type {(inputs: Panel_Tab_StoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verhaal`)
};

/**
* | output |
* | --- |
* | "Story" |
*
* @param {Panel_Tab_StoryInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_tab_story = /** @type {((inputs?: Panel_Tab_StoryInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_StoryInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_tab_story(inputs)
	if (locale === "zu") return zu_panel_tab_story(inputs)
	if (locale === "xh") return xh_panel_tab_story(inputs)
	if (locale === "af") return af_panel_tab_story(inputs)
	return en_panel_tab_story(inputs)
});