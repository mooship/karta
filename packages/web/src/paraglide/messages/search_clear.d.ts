export type LocalizedString = import('../runtime.js').LocalizedString;
export type Search_ClearInputs = {};
/**
* | output |
* | --- |
* | "Clear search" |
*
* @param {Search_ClearInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const search_clear: ((inputs?: Search_ClearInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_ClearInputs, {
    locale?: "en" | "af";
}, {}>;
