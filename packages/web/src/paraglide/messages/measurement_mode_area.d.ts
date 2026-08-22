export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_Mode_AreaInputs = {};
/**
* | output |
* | --- |
* | "Area" |
*
* @param {Measurement_Mode_AreaInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_mode_area: ((inputs?: Measurement_Mode_AreaInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_Mode_AreaInputs, {
    locale?: "en" | "af";
}, {}>;
