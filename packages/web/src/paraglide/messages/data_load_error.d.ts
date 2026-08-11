export type LocalizedString = import('../runtime.js').LocalizedString;
export type Data_Load_ErrorInputs = {};
/**
* | output |
* | --- |
* | "Map data could not be loaded." |
*
* @param {Data_Load_ErrorInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const data_load_error: ((inputs?: Data_Load_ErrorInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Data_Load_ErrorInputs, {
    locale?: "en";
}, {}>;
