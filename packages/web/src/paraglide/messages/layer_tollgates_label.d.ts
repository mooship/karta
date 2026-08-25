export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Tollgates_LabelInputs = {};
/**
* | output |
* | --- |
* | "Toll plazas" |
*
* @param {Layer_Tollgates_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_tollgates_label: ((inputs?: Layer_Tollgates_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Tollgates_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
