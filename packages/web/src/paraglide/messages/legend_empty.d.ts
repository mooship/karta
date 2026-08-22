export type LocalizedString = import('../runtime.js').LocalizedString;
export type Legend_EmptyInputs = {};
/**
* | output |
* | --- |
* | "Turn on layers to view their legend." |
*
* @param {Legend_EmptyInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const legend_empty: ((inputs?: Legend_EmptyInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_EmptyInputs, {
    locale?: "en" | "af";
}, {}>;
