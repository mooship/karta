export type LocalizedString = import('../runtime.js').LocalizedString;
export type Legend_No_DataInputs = {};
/**
* | output |
* | --- |
* | "No data" |
*
* @param {Legend_No_DataInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const legend_no_data: ((inputs?: Legend_No_DataInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Legend_No_DataInputs, {
    locale?: "en" | "af";
}, {}>;
