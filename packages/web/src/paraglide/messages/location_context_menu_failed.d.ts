export type LocalizedString = import('../runtime.js').LocalizedString;
export type Location_Context_Menu_FailedInputs = {};
/**
* | output |
* | --- |
* | "Couldn't look up this address." |
*
* @param {Location_Context_Menu_FailedInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const location_context_menu_failed: ((inputs?: Location_Context_Menu_FailedInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_FailedInputs, {
    locale?: "en" | "af";
}, {}>;
