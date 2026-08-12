export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Bus_Rapid_Transit_LabelInputs = {};
/**
* | output |
* | --- |
* | "Bus Rapid Transit" |
*
* @param {Layer_Bus_Rapid_Transit_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export declare const layer_bus_rapid_transit_label: ((inputs?: Layer_Bus_Rapid_Transit_LabelInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Bus_Rapid_Transit_LabelInputs, {
    locale?: "en" | "st" | "zu" | "xh";
}, {}>;
