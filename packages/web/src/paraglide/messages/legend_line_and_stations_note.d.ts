export type LocalizedString = import('../runtime.js').LocalizedString;
export type Legend_Line_And_Stations_NoteInputs = {};
/**
* | output |
* | --- |
* | "· line + stations" |
*
* @param {Legend_Line_And_Stations_NoteInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const legend_line_and_stations_note: ((inputs?: Legend_Line_And_Stations_NoteInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Line_And_Stations_NoteInputs, {
    locale?: "en" | "af";
}, {}>;
