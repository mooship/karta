export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_Aria_LabelInputs = {};
/**
* | output |
* | --- |
* | "Measurement tool" |
*
* @param {Measurement_Aria_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_aria_label: ((inputs?: Measurement_Aria_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Aria_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
