export type LocalizedString = import('../runtime.js').LocalizedString;
export type Domain_Story_TitleInputs = {};
/**
* | output |
* | --- |
* | "Why this map exists" |
*
* @param {Domain_Story_TitleInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const domain_story_title: ((inputs?: Domain_Story_TitleInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Story_TitleInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
