export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Set_Theme_SwitchedInputs = {
    theme: NonNullable<unknown>;
};
/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */
/** @typedef {{ theme: NonNullable<unknown> }} Webmcp_Set_Theme_SwitchedInputs */
/**
* | output |
* | --- |
* | "Theme switched to \"{theme}\"." |
*
* @param {Webmcp_Set_Theme_SwitchedInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_set_theme_switched: ((inputs: Webmcp_Set_Theme_SwitchedInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Theme_SwitchedInputs, {
    locale?: "en" | "af";
}, {}>;
