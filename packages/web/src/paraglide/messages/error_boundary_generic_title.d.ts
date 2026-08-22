export type LocalizedString = import('../runtime.js').LocalizedString;
export type Error_Boundary_Generic_TitleInputs = {};
/**
* | output |
* | --- |
* | "Something went wrong" |
*
* @param {Error_Boundary_Generic_TitleInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const error_boundary_generic_title: ((inputs?: Error_Boundary_Generic_TitleInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Generic_TitleInputs, {
    locale?: "en" | "af";
}, {}>;
