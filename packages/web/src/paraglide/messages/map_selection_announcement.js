/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Map_Selection_AnnouncementInputs */

const en_map_selection_announcement = /** @type {(inputs: Map_Selection_AnnouncementInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label} selected`)
};

const af_map_selection_announcement = /** @type {(inputs: Map_Selection_AnnouncementInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.label} gekies`)
};

/**
* | output |
* | --- |
* | "{label} selected" |
*
* @param {Map_Selection_AnnouncementInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const map_selection_announcement = /** @type {((inputs: Map_Selection_AnnouncementInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Map_Selection_AnnouncementInputs, { locale?: "en" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return af_map_selection_announcement(inputs)
	return en_map_selection_announcement(inputs)
});