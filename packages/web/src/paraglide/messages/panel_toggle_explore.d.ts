export type LocalizedString = import('../runtime.js').LocalizedString;
export type Panel_Toggle_ExploreInputs = {};
/**
* | output |
* | --- |
* | "Explore" |
*
* @param {Panel_Toggle_ExploreInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export declare const panel_toggle_explore: ((inputs?: Panel_Toggle_ExploreInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Toggle_ExploreInputs, {
    locale?: "en" | "st" | "zu" | "xh";
}, {}>;
