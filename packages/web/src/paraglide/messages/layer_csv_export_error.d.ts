export type LocalizedString = import('../runtime.js').LocalizedString;
export type Layer_Csv_Export_ErrorInputs = {};
/**
* | output |
* | --- |
* | "Couldn't prepare the CSV file. Try again." |
*
* @param {Layer_Csv_Export_ErrorInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const layer_csv_export_error: ((inputs?: Layer_Csv_Export_ErrorInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Layer_Csv_Export_ErrorInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
