export type LocalizedString = import('../runtime.js').LocalizedString;
export type Location_Context_Menu_Aria_LabelInputs = {};
/**
* | output |
* | --- |
* | "Map location actions" |
*
* @param {Location_Context_Menu_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const location_context_menu_aria_label: ((inputs?: Location_Context_Menu_Aria_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_Aria_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
