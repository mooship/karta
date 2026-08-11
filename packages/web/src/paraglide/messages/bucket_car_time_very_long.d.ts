export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Car_Time_Very_LongInputs = {};
/**
* | output |
* | --- |
* | "Very long (> 60 min)" |
*
* @param {Bucket_Car_Time_Very_LongInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const bucket_car_time_very_long: ((inputs?: Bucket_Car_Time_Very_LongInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_Very_LongInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
