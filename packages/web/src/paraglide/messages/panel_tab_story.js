/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tab_StoryInputs */

const en_panel_tab_story = /** @type {(inputs: Panel_Tab_StoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Story`)
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
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const panel_tab_story = /** @type {((inputs?: Panel_Tab_StoryInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_StoryInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_panel_tab_story(inputs)
	return en_panel_tab_story(inputs)
});