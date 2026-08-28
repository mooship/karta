export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Spatial_Burden_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "A combined score weighting modelled car time and distance to transit together, to show where both burdens compound." |
*
* @param {Layer_Spatial_Burden_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_spatial_burden_description: ((inputs?: Layer_Spatial_Burden_DescriptionInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Spatial_Burden_DescriptionInputs, {
    locale?: "en" | "af";
}, {}>;
