export type LocalizedString = import('../runtime.js').LocalizedString;
export type Error_Boundary_Generic_MessageInputs = {};
/**
* | output |
* | --- |
* | "An unexpected error occurred. Reloading the page usually fixes it." |
*
* @param {Error_Boundary_Generic_MessageInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" }} options
* @returns {LocalizedString}
*/
export declare const error_boundary_generic_message: ((inputs?: Error_Boundary_Generic_MessageInputs, options?: {
    locale?: "en" | "st" | "zu" | "xh";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Generic_MessageInputs, {
    locale?: "en" | "st" | "zu" | "xh";
}, {}>;
