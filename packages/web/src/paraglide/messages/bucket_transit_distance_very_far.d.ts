export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Transit_Distance_Very_FarInputs = {};
/**
* | output |
* | --- |
* | "Very far (> 8 km)" |
*
* @param {Bucket_Transit_Distance_Very_FarInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const bucket_transit_distance_very_far: ((inputs?: Bucket_Transit_Distance_Very_FarInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_Very_FarInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
