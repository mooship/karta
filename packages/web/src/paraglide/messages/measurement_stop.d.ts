export type LocalizedString = import('../runtime.js').LocalizedString;
export type Measurement_StopInputs = {};
/**
* | output |
* | --- |
* | "Stop measuring" |
*
* @param {Measurement_StopInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const measurement_stop: ((inputs?: Measurement_StopInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Measurement_StopInputs, {
    locale?: "en" | "af";
}, {}>;
