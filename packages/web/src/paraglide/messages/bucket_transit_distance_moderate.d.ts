export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Transit_Distance_ModerateInputs = {};
/**
* | output |
* | --- |
* | "Moderate (1–3 km)" |
*
* @param {Bucket_Transit_Distance_ModerateInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const bucket_transit_distance_moderate: ((inputs?: Bucket_Transit_Distance_ModerateInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Transit_Distance_ModerateInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
