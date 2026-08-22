export type LocalizedString = import('../runtime.js').LocalizedString;
export type Domain_Story_BodyInputs = {};
/**
* | output |
* | --- |
* | "Apartheid law controlled where Black, Coloured and Indian people could live. Black townships were deliberately separated from economic centres, and those dis..." |
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
