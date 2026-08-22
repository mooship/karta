export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_Mode_LabelInputs = {};
/**
* | output |
* | --- |
* | "Measurement mode" |
*
* @param {Measurement_Mode_LabelInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_mode_label: ((inputs?: Measurement_Mode_LabelInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Mode_LabelInputs, {
    locale?: "en" | "af";
}, {}>;
