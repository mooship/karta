export type LocalizedString = import('../runtime.js').LocalizedString;
export type Legend_OpenInputs = {};
/**
* | output |
* | --- |
* | "Open map legend" |
*
* @param {Legend_OpenInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const legend_open: ((inputs?: Legend_OpenInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_OpenInputs, {
    locale?: "en" | "af";
}, {}>;
