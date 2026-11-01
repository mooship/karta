/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_Line_And_Stations_NoteInputs */



/**
* | output |
* | --- |
* | "· line + stations" |
*
* @param {Legend_Line_And_Stations_NoteInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const legend_line_and_stations_note = /** @type {((inputs?: Legend_Line_And_Stations_NoteInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Line_And_Stations_NoteInputs, { locale?: "en" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (" · lyn + stasies")
	return /** @type {LocalizedString} */ (" · line + stations")
});