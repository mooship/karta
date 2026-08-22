/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Legend_Line_And_Stations_NoteInputs */

const en_legend_line_and_stations_note = /** @type {(inputs: Legend_Line_And_Stations_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` · line + stations`)
};

const af_legend_line_and_stations_note = /** @type {(inputs: Legend_Line_And_Stations_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` · lyn + stasies`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_legend_line_and_stations_note(inputs)
	return en_legend_line_and_stations_note(inputs)
});