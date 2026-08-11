export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Nearest_Transit_LabelInputs = {};
/**
* | output |
* | --- |
* | "Distance to Nearest Transit" |
*
* @param {Layer_Nearest_Transit_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const layer_nearest_transit_label: ((inputs?: Layer_Nearest_Transit_LabelInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Nearest_Transit_LabelInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
