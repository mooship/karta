export type LocalizedString = import('../runtime.js').LocalizedString;
export type Browse_Empty_MessageInputs = {};
/**
* | output |
* | --- |
* | "No matches found" |
*
* @param {Browse_Empty_MessageInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const browse_empty_message: ((inputs?: Browse_Empty_MessageInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Browse_Empty_MessageInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
