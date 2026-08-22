export type LocalizedString = import('../runtime.js').LocalizedString;
export type Distance_KmInputs = {
    value: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "{value} km" |
*
* @param {Distance_KmInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const distance_km: ((inputs: Distance_KmInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Distance_KmInputs, {
    locale?: "en" | "af";
}, {}>;
