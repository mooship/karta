export type LocalizedString = import('../runtime.js').LocalizedString;
export type Error_Boundary_ReloadInputs = {};
/**
* | output |
* | --- |
* | "Reload page" |
*
* @param {Error_Boundary_ReloadInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const error_boundary_reload: ((inputs?: Error_Boundary_ReloadInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Boundary_ReloadInputs, {
    locale?: "en" | "af";
}, {}>;
