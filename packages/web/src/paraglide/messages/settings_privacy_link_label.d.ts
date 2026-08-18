export type LocalizedString = import('../runtime.js').LocalizedString;
export type Settings_Privacy_Link_LabelInputs = {};
/**
* | output |
* | --- |
* | "Privacy policy" |
*
* @param {Settings_Privacy_Link_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const settings_privacy_link_label: ((inputs?: Settings_Privacy_Link_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Privacy_Link_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
