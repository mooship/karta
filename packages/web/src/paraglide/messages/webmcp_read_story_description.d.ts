export type LocalizedString = import('../runtime.js').LocalizedString;
export type Webmcp_Read_Story_DescriptionInputs = {};
/**
* | output |
* | --- |
* | "Read this map's background story explaining why it exists, and open the Story panel." |
*
* @param {Webmcp_Read_Story_DescriptionInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export declare const webmcp_read_story_description: ((inputs?: Webmcp_Read_Story_DescriptionInputs, options?: {
    locale?: "en" | "af";
}) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Read_Story_DescriptionInputs, {
    locale?: "en" | "af";
}, {}>;
