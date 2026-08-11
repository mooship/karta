export type LocalizedString = import('../runtime.js').LocalizedString;
export type Panel_Reduce_HeightInputs = {};
/**
* | output |
* | --- |
* | "Reduce panel height" |
*
* @param {Panel_Reduce_HeightInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const panel_reduce_height: ((inputs?: Panel_Reduce_HeightInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Reduce_HeightInputs, {
    locale?: "en";
}, {}>;
