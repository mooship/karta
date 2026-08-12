export type LocalizedString = import('../runtime.js').LocalizedString;
export type Skip_To_Map_InformationInputs = {};
/**
* | output |
* | --- |
* | "Skip to map information" |
*
* @param {Skip_To_Map_InformationInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export declare const skip_to_map_information: ((inputs?: Skip_To_Map_InformationInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Skip_To_Map_InformationInputs, {
    locale?: "en" | "st" | "zu" | "xh";
}, {}>;
