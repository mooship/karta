export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Car_Time_LongInputs = {};
/**
* | output |
* | --- |
* | "Long (41–60 min)" |
*
* @param {Bucket_Car_Time_LongInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export declare const bucket_car_time_long: ((inputs?: Bucket_Car_Time_LongInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_LongInputs, {
    locale?: "en" | "st" | "zu" | "xh";
}, {}>;
