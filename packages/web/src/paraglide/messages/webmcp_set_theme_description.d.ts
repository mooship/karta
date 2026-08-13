export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Set_Theme_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Switch the app's colour theme. \"system\" follows the OS preference." |
*
* @param {Webmcp_Set_Theme_DescriptionInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_set_theme_description: ((inputs?: Webmcp_Set_Theme_DescriptionInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Theme_DescriptionInputs, {
    locale?: "en" | "st" | "zu" | "xh" | "af";
}, {}>;
