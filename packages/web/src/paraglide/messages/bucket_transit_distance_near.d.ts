export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Transit_Distance_NearInputs = {};
/**
* | output |
* | --- |
* | "Near (≤ 1 km)" |
*
* @param {Bucket_Transit_Distance_NearInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const bucket_transit_distance_near: ((inputs?: Bucket_Transit_Distance_NearInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_NearInputs, {
    locale?: "en" | "af";
}, {}>;
