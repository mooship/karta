export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Spatial_Burden_SevereInputs = {};
/**
* | output |
* | --- |
* | "Severe" |
*
* @param {Bucket_Spatial_Burden_SevereInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const bucket_spatial_burden_severe: ((inputs?: Bucket_Spatial_Burden_SevereInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Spatial_Burden_SevereInputs, {
    locale?: "en" | "af";
}, {}>;
