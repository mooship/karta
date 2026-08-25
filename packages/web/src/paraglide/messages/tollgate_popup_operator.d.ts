export type LocalizedString = import('../runtime.js').LocalizedString;
export type Tollgate_Popup_OperatorInputs = {};
/**
* | output |
* | --- |
* | "Operator" |
*
* @param {Tollgate_Popup_OperatorInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const tollgate_popup_operator: ((inputs?: Tollgate_Popup_OperatorInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Tollgate_Popup_OperatorInputs, {
    locale?: "en" | "af";
}, {}>;
