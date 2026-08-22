export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Commuter_Rail_LabelInputs = {};
/**
* | output |
* | --- |
* | "Commuter Rail" |
*
* @param {Layer_Commuter_Rail_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_commuter_rail_label: ((inputs?: Layer_Commuter_Rail_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Commuter_Rail_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
