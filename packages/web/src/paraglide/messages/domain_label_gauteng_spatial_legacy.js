/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Domain_Label_Gauteng_Spatial_LegacyInputs */

const en_domain_label_gauteng_spatial_legacy = /** @type {(inputs: Domain_Label_Gauteng_Spatial_LegacyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Spatial legacy`)
};

const st_domain_label_gauteng_spatial_legacy = /** @type {(inputs: Domain_Label_Gauteng_Spatial_LegacyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lefa la sebaka`)
};

const zu_domain_label_gauteng_spatial_legacy = /** @type {(inputs: Domain_Label_Gauteng_Spatial_LegacyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ifa lendawo`)
};

const xh_domain_label_gauteng_spatial_legacy = /** @type {(inputs: Domain_Label_Gauteng_Spatial_LegacyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ilifa lendawo`)
};

const af_domain_label_gauteng_spatial_legacy = /** @type {(inputs: Domain_Label_Gauteng_Spatial_LegacyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ruimtelike nalatenskap`)
};

/**
* | output |
* | --- |
* | "Spatial legacy" |
*
* @param {Domain_Label_Gauteng_Spatial_LegacyInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const domain_label_gauteng_spatial_legacy = /** @type {((inputs?: Domain_Label_Gauteng_Spatial_LegacyInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Domain_Label_Gauteng_Spatial_LegacyInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_domain_label_gauteng_spatial_legacy(inputs)
	if (locale === "zu") return zu_domain_label_gauteng_spatial_legacy(inputs)
	if (locale === "xh") return xh_domain_label_gauteng_spatial_legacy(inputs)
	if (locale === "af") return af_domain_label_gauteng_spatial_legacy(inputs)
	return en_domain_label_gauteng_spatial_legacy(inputs)
});