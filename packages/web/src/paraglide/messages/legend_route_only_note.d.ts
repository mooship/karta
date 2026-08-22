export type LocalizedString = import('../runtime.js').LocalizedString;
export type Legend_Route_Only_NoteInputs = {};
/**
* | output |
* | --- |
* | "· route only" |
*
* @param {Legend_Route_Only_NoteInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const legend_route_only_note: ((inputs?: Legend_Route_Only_NoteInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_Route_Only_NoteInputs, {
    locale?: "en" | "af";
}, {}>;
