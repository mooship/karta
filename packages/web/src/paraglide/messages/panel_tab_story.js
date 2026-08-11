/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Tab_StoryInputs */

const en_panel_tab_story = /** @type {(inputs: Panel_Tab_StoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Story`)
};

/**
* | output |
* | --- |
* | "Story" |
*
* @param {Panel_Tab_StoryInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const panel_tab_story = /** @type {((inputs?: Panel_Tab_StoryInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_StoryInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_panel_tab_story(inputs)
});