export type LocalizedString = import('../runtime.js').LocalizedString;
export type Search_Aria_LabelInputs = {};
/**
* | output |
* | --- |
* | "Location search" |
*
* @param {Search_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const search_aria_label: ((inputs?: Search_Aria_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Search_Aria_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
