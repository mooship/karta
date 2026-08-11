/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Toggle_ExploreInputs */

const en_panel_toggle_explore = /** @type {(inputs: Panel_Toggle_ExploreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Explore`)
};

/**
* | output |
* | --- |
* | "Explore" |
*
* @param {Panel_Toggle_ExploreInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export const panel_toggle_explore = /** @type {((inputs?: Panel_Toggle_ExploreInputs, options?: { locale?: "en" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Toggle_ExploreInputs, { locale?: "en" }, {}>} */ ((inputs = {}, options = {}) => {
	experimentalStaticLocale ?? options.locale ?? getLocale()
	return en_panel_toggle_explore(inputs)
});