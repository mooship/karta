export type LocalizedString = import('../runtime.js').LocalizedString;
export type Search_PlaceholderInputs = {};
/**
* | output |
* | --- |
* | "Search town, suburb or station" |
*
* @param {Search_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const search_placeholder: ((inputs?: Search_PlaceholderInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_PlaceholderInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
