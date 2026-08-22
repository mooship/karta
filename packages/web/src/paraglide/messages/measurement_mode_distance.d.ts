export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_Mode_DistanceInputs = {};
/**
* | output |
* | --- |
* | "Distance" |
*
* @param {Measurement_Mode_DistanceInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_mode_distance: ((inputs?: Measurement_Mode_DistanceInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Mode_DistanceInputs, {
    locale?: "en" | "af";
}, {}>;
