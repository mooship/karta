export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Transit_Distance_FarInputs = {};
/**
* | output |
* | --- |
* | "Far (3–8 km)" |
*
* @param {Bucket_Transit_Distance_FarInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const bucket_transit_distance_far: ((inputs?: Bucket_Transit_Distance_FarInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_FarInputs, {
    locale?: "en" | "af";
}, {}>;
