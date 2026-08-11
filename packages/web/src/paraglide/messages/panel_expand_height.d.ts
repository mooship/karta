export type LocalizedString = import('../runtime.js').LocalizedString;
export type Panel_Expand_HeightInputs = {};
/**
* | output |
* | --- |
* | "Expand panel height" |
*
* @param {Panel_Expand_HeightInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const panel_expand_height: ((inputs?: Panel_Expand_HeightInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Expand_HeightInputs, {
    locale?: "en";
}, {}>;
