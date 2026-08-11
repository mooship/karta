export type LocalizedString = import('../runtime.js').LocalizedString;
export type Error_Boundary_Not_Found_MessageInputs = {};
/**
* | output |
* | --- |
* | "The page you're looking for doesn't exist." |
*
* @param {Error_Boundary_Not_Found_MessageInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" }} options
* @returns {LocalizedString}
*/
export declare const error_boundary_not_found_message: ((inputs?: Error_Boundary_Not_Found_MessageInputs, options?: {
    locale?: "en" | "st" | "zu";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Not_Found_MessageInputs, {
    locale?: "en" | "st" | "zu";
}, {}>;
