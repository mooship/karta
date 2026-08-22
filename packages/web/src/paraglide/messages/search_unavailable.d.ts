export type LocalizedString = import('../runtime.js').LocalizedString;
export type Search_UnavailableInputs = {};
/**
* | output |
* | --- |
* | "Search is unavailable right now. Please try again." |
*
* @param {Search_UnavailableInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const search_unavailable: ((inputs?: Search_UnavailableInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_UnavailableInputs, {
    locale?: "en" | "af";
}, {}>;
