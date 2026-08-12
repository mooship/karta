export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Townships_LabelInputs = {};
/**
* | output |
* | --- |
* | "Modelled car time" |
*
* @param {Layer_Townships_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export declare const layer_townships_label: ((inputs?: Layer_Townships_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Townships_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh";
}, {}>;
