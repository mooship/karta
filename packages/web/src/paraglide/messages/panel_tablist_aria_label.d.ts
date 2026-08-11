export type LocalizedString = import('../runtime.js').LocalizedString;
export type Panel_Tablist_Aria_LabelInputs = {};
/**
* | output |
* | --- |
* | "Map panel" |
*
* @param {Panel_Tablist_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const panel_tablist_aria_label: ((inputs?: Panel_Tablist_Aria_LabelInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tablist_Aria_LabelInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
