export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Bus_LabelInputs = {};
/**
* | output |
* | --- |
* | "Bus" |
*
* @param {Layer_Bus_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_bus_label: ((inputs?: Layer_Bus_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Bus_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
