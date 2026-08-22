export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Townships_LabelInputs = {};
/**
* | output |
* | --- |
* | "Modelled car time" |
*
* @param {Layer_Townships_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_townships_label: ((inputs?: Layer_Townships_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Townships_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
