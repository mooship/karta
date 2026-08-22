export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_ToggleInputs = {};
/**
* | output |
* | --- |
* | "Measure distance and area" |
*
* @param {Measurement_ToggleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_toggle: ((inputs?: Measurement_ToggleInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_ToggleInputs, {
    locale?: "en" | "af";
}, {}>;
