export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Rapid_Rail_LabelInputs = {};
/**
* | output |
* | --- |
* | "Rapid Rail" |
*
* @param {Layer_Rapid_Rail_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_rapid_rail_label: ((inputs?: Layer_Rapid_Rail_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Rapid_Rail_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
