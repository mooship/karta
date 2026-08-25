export type LocalizedString = import('../runtime.js').LocalizedString;
export type Tollgate_Popup_RouteInputs = {};
/**
* | output |
* | --- |
* | "Route" |
*
* @param {Tollgate_Popup_RouteInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const tollgate_popup_route: ((inputs?: Tollgate_Popup_RouteInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Tollgate_Popup_RouteInputs, {
    locale?: "en" | "af";
}, {}>;
