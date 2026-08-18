export type LocalizedString = import('../runtime.js').LocalizedString;
export type Browse_List_Aria_LabelInputs = {
    layer: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Browse {layer}" |
*
* @param {Browse_List_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const browse_list_aria_label: ((inputs: Browse_List_Aria_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Browse_List_Aria_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
