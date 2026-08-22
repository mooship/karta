export type LocalizedString = import('../runtime.js').LocalizedString;
export type Commute_No_DataInputs = {};
/**
* | output |
* | --- |
* | "No data" |
*
* @param {Commute_No_DataInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const commute_no_data: ((inputs?: Commute_No_DataInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Commute_No_DataInputs, {
    locale?: "en" | "af";
}, {}>;
