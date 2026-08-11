export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Car_Time_ModerateInputs = {};
/**
* | output |
* | --- |
* | "Moderate (21–40 min)" |
*
* @param {Bucket_Car_Time_ModerateInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const bucket_car_time_moderate: ((inputs?: Bucket_Car_Time_ModerateInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_ModerateInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
