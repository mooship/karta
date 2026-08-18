export type LocalizedString = import('../runtime.js').LocalizedString;
export type Domain_Switcher_LabelInputs = {};
/**
* | output |
* | --- |
* | "Choose a map" |
*
* @param {Domain_Switcher_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const domain_switcher_label: ((inputs?: Domain_Switcher_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Switcher_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
