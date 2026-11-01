/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_Route_Only_NoteInputs */



/**
* | output |
* | --- |
* | "· route only" |
*
* @param {Legend_Route_Only_NoteInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_route_only_note = /** @type {((inputs?: Legend_Route_Only_NoteInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Route_Only_NoteInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (" · net roete")
	return /** @type {LocalizedString} */ (" · route only")
});