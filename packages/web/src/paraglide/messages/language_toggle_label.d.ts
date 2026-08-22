export type LocalizedString = import('../runtime.js').LocalizedString;
export type Language_Toggle_LabelInputs = {};
/**
* | output |
* | --- |
* | "Language" |
*
* @param {Language_Toggle_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const language_toggle_label: ((inputs?: Language_Toggle_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Language_Toggle_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
