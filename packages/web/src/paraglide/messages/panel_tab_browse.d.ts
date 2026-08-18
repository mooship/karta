export type LocalizedString = import('../runtime.js').LocalizedString;
export type Panel_Tab_BrowseInputs = {};
/**
* | output |
* | --- |
* | "Browse" |
*
* @param {Panel_Tab_BrowseInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const panel_tab_browse: ((inputs?: Panel_Tab_BrowseInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_BrowseInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
