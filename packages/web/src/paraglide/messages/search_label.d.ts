export type LocalizedString = import('../runtime.js').LocalizedString;
export type Search_LabelInputs = {};
/**
* | output |
* | --- |
* | "Search place" |
*
* @param {Search_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const search_label: ((inputs?: Search_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
