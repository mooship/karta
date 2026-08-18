/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Privacy_Link_LabelInputs */

const en_settings_privacy_link_label = /** @type {(inputs: Settings_Privacy_Link_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Privacy policy`)
};

const st_settings_privacy_link_label = /** @type {(inputs: Settings_Privacy_Link_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pholisi ya lekunutu`)
};

const zu_settings_privacy_link_label = /** @type {(inputs: Settings_Privacy_Link_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inqubomgomo yobumfihlo`)
};

const xh_settings_privacy_link_label = /** @type {(inputs: Settings_Privacy_Link_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umgaqo-nkqubo wabucala`)
};

const af_settings_privacy_link_label = /** @type {(inputs: Settings_Privacy_Link_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Privaatheidsbeleid`)
};

/**
* | output |
* | --- |
* | "Privacy policy" |
*
* @param {Settings_Privacy_Link_LabelInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const settings_privacy_link_label = /** @type {((inputs?: Settings_Privacy_Link_LabelInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Privacy_Link_LabelInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_settings_privacy_link_label(inputs)
	if (locale === "zu") return zu_settings_privacy_link_label(inputs)
	if (locale === "xh") return xh_settings_privacy_link_label(inputs)
	if (locale === "af") return af_settings_privacy_link_label(inputs)
	return en_settings_privacy_link_label(inputs)
});