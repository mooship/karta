export type LocalizedString = import('../runtime.js').LocalizedString;
export type Error_Boundary_Not_Found_TitleInputs = {};
/**
* | output |
* | --- |
* | "Page not found" |
*
* @param {Error_Boundary_Not_Found_TitleInputs} inputs
* @param {{ locale?: "en" }} options
* @returns {LocalizedString}
*/
export declare const error_boundary_not_found_title: ((inputs?: Error_Boundary_Not_Found_TitleInputs, options?: {
    locale?: "en";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_Not_Found_TitleInputs, {
    locale?: "en";
}, {}>;
