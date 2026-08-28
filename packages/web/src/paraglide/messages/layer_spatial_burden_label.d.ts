export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Spatial_Burden_LabelInputs = {};
/**
* | output |
* | --- |
* | "Combined spatial burden" |
*
* @param {Layer_Spatial_Burden_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_spatial_burden_label: ((inputs?: Layer_Spatial_Burden_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Spatial_Burden_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
