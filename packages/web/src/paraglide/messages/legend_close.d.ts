export type LocalizedString = import('../runtime.js').LocalizedString;
export type Legend_CloseInputs = {};
/**
* | output |
* | --- |
* | "Close map legend" |
*
* @param {Legend_CloseInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const legend_close: ((inputs?: Legend_CloseInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_CloseInputs, {
    locale?: "en" | "af";
}, {}>;
