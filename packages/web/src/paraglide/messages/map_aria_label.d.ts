export type LocalizedString = import('../runtime.js').LocalizedString;
export type Map_Aria_LabelInputs = {};
/**
* | output |
* | --- |
* | "Map of South African township access to job centres" |
*
* @param {Map_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const map_aria_label: ((inputs?: Map_Aria_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Map_Aria_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
