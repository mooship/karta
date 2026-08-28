export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Spatial_Burden_LowInputs = {};
/**
* | output |
* | --- |
* | "Low" |
*
* @param {Bucket_Spatial_Burden_LowInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const bucket_spatial_burden_low: ((inputs?: Bucket_Spatial_Burden_LowInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Spatial_Burden_LowInputs, {
    locale?: "en" | "af";
}, {}>;
