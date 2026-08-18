export type LocalizedString = import('../runtime.js').LocalizedString;
export type Browse_Search_PlaceholderInputs = {};
/**
* | output |
* | --- |
* | "Search" |
*
* @param {Browse_Search_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const browse_search_placeholder: ((inputs?: Browse_Search_PlaceholderInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Browse_Search_PlaceholderInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
