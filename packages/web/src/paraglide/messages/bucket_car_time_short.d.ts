export type LocalizedString = import('../runtime.js').LocalizedString;
export type Bucket_Car_Time_ShortInputs = {};
/**
* | output |
* | --- |
* | "Short (≤ 20 min)" |
*
* @param {Bucket_Car_Time_ShortInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const bucket_car_time_short: ((inputs?: Bucket_Car_Time_ShortInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Bucket_Car_Time_ShortInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
