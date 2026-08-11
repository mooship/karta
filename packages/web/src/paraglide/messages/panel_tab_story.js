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

/**
* | output |
* | --- |
* | "Story" |
*
* @param {Panel_Tab_StoryInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export const panel_tab_story = /** @type {((inputs?: Panel_Tab_StoryInputs, options?: { locale?: "en" | "st" | "zu" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_StoryInputs, { locale?: "en" | "st" | "zu" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_panel_tab_story(inputs)
	if (locale === "zu") return zu_panel_tab_story(inputs)
	return en_panel_tab_story(inputs)
});