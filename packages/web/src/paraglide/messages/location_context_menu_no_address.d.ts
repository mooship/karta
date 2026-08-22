export type LocalizedString = import('../runtime.js').LocalizedString;
export type Location_Context_Menu_No_AddressInputs = {};
/**
* | output |
* | --- |
* | "No address found here." |
*
* @param {Location_Context_Menu_No_AddressInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const location_context_menu_no_address: ((inputs?: Location_Context_Menu_No_AddressInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_No_AddressInputs, {
    locale?: "en" | "af";
}, {}>;
