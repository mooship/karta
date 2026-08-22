export type LocalizedString = import('../runtime.js').LocalizedString;
export type Location_Context_Menu_Search_HereInputs = {};
/**
* | output |
* | --- |
* | "Search this location" |
*
* @param {Location_Context_Menu_Search_HereInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const location_context_menu_search_here: ((inputs?: Location_Context_Menu_Search_HereInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Location_Context_Menu_Search_HereInputs, {
    locale?: "en" | "af";
}, {}>;
