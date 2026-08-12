export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Nearest_Transit_LabelInputs = {};
/**
* | output |
* | --- |
* | "Distance to nearest transit" |
*
* @param {Layer_Nearest_Transit_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export declare const layer_nearest_transit_label: ((inputs?: Layer_Nearest_Transit_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Nearest_Transit_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh";
}, {}>;
