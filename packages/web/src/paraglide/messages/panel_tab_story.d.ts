export type LocalizedString = import('../runtime.js').LocalizedString;
export type Panel_Tab_StoryInputs = {};
/**
* | output |
* | --- |
* | "Story" |
*
* @param {Panel_Tab_StoryInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const panel_tab_story: ((inputs?: Panel_Tab_StoryInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Tab_StoryInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
