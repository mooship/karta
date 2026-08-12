export type LocalizedString = import('../runtime.js').LocalizedString;
export type Language_Toggle_LabelInputs = {};
/**
* | output |
* | --- |
* | "Language" |
*
* @param {Language_Toggle_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const language_toggle_label: ((inputs?: Language_Toggle_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Language_Toggle_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
