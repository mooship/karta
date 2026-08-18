export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Heritage_Sites_LabelInputs = {};
/**
* | output |
* | --- |
* | "Struggle heritage sites" |
*
* @param {Layer_Heritage_Sites_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_heritage_sites_label: ((inputs?: Layer_Heritage_Sites_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Heritage_Sites_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
