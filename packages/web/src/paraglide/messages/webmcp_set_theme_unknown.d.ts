export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Set_Theme_UnknownInputs = {
    theme: NonNullable<unknown>;
};
/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{ theme: NonNullable<unknown> }} Webmcp_Set_Theme_UnknownInputs */
/**
* | output |
* | --- |
* | "Unknown theme \"{theme}\"." |
*
* @param {Webmcp_Set_Theme_UnknownInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_set_theme_unknown: ((inputs: Webmcp_Set_Theme_UnknownInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Theme_UnknownInputs, {
    locale?: "en" | "af";
}, {}>;
