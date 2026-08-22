export type LocalizedString = import('../runtime.js').LocalizedString;
export type Search_No_ResultsInputs = {};
/**
* | output |
* | --- |
* | "Nothing matched that search." |
*
* @param {Search_No_ResultsInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const search_no_results: ((inputs?: Search_No_ResultsInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_No_ResultsInputs, {
    locale?: "en" | "af";
}, {}>;
