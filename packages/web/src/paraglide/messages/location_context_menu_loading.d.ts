export type LocalizedString = import('../runtime.js').LocalizedString;
export type Location_Context_Menu_LoadingInputs = {};
/**
* | output |
* | --- |
* | "Looking up address…" |
*
* @param {Location_Context_Menu_LoadingInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const location_context_menu_loading: ((inputs?: Location_Context_Menu_LoadingInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_LoadingInputs, {
    locale?: "en" | "af";
}, {}>;
