export type LocalizedString = import('../runtime.js').LocalizedString;
export type Search_SearchingInputs = {};
/**
* | output |
* | --- |
* | "Searching places..." |
*
* @param {Search_SearchingInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const search_searching: ((inputs?: Search_SearchingInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_SearchingInputs, {
    locale?: "en" | "af";
}, {}>;
