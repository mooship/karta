export type LocalizedString = import('../runtime.js').LocalizedString;
export type Panel_Toggle_CloseInputs = {};
/**
* | output |
* | --- |
* | "Close" |
*
* @param {Panel_Toggle_CloseInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const panel_toggle_close: ((inputs?: Panel_Toggle_CloseInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Toggle_CloseInputs, {
    locale?: "en";
}, {}>;
