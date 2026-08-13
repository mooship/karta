export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Set_Theme_UnknownInputs = {
    theme: NonNullable<unknown>;
};
/**
* | output |
* | --- |
* | "Unknown theme \"{theme}\"." |
*
* @param {Webmcp_Set_Theme_UnknownInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_set_theme_unknown: ((inputs: Webmcp_Set_Theme_UnknownInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Theme_UnknownInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
