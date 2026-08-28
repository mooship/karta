export type LocalizedString = import('../runtime.js').LocalizedString;
export type Domain_Story_BodyInputs = {};
/**
* | output |
* | --- |
* | "South Africa's Group Areas Act (1950) didn't just segregate where people could live — it engineered distance as policy. Black, Coloured and Indian communitie..." |
*
* @param {Domain_Story_BodyInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const domain_story_body: ((inputs?: Domain_Story_BodyInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Story_BodyInputs, {
    locale?: "en" | "af";
}, {}>;
