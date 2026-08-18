export type LocalizedString = import('../runtime.js').LocalizedString;
export type Heritage_Popup_SummaryInputs = {};
/**
* | output |
* | --- |
* | "Summary" |
*
* @param {Heritage_Popup_SummaryInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const heritage_popup_summary: ((inputs?: Heritage_Popup_SummaryInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Heritage_Popup_SummaryInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
