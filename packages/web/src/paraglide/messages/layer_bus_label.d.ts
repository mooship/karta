export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Bus_LabelInputs = {};
/**
* | output |
* | --- |
* | "Bus" |
*
* @param {Layer_Bus_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const layer_bus_label: ((inputs?: Layer_Bus_LabelInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Bus_LabelInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
