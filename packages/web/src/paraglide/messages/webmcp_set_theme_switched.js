/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ theme: NonNullable<unknown> }} Webmcp_Set_Theme_SwitchedInputs */

const en_webmcp_set_theme_switched = /** @type {(inputs: Webmcp_Set_Theme_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Theme switched to "${i?.theme}".`)
};

const st_webmcp_set_theme_switched = /** @type {(inputs: Webmcp_Set_Theme_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sehlooho se fetoletsoe ho "${i?.theme}".`)
};

const zu_webmcp_set_theme_switched = /** @type {(inputs: Webmcp_Set_Theme_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Itimu ishintshelwe ku-"${i?.theme}".`)
};

const xh_webmcp_set_theme_switched = /** @type {(inputs: Webmcp_Set_Theme_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Umxholo utshintshelwe ku-"${i?.theme}".`)
};

const af_webmcp_set_theme_switched = /** @type {(inputs: Webmcp_Set_Theme_SwitchedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tema verander na "${i?.theme}".`)
};

/**
* | output |
* | --- |
* | "Theme switched to \"{theme}\"." |
*
* @param {Webmcp_Set_Theme_SwitchedInputs} inputs
* @param {{ locale?: "en" | "st" | "zu" | "xh" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_set_theme_switched = /** @type {((inputs: Webmcp_Set_Theme_SwitchedInputs, options?: { locale?: "en" | "st" | "zu" | "xh" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Set_Theme_SwitchedInputs, { locale?: "en" | "st" | "zu" | "xh" | "af" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "st") return st_webmcp_set_theme_switched(inputs)
	if (locale === "zu") return zu_webmcp_set_theme_switched(inputs)
	if (locale === "xh") return xh_webmcp_set_theme_switched(inputs)
	if (locale === "af") return af_webmcp_set_theme_switched(inputs)
	return en_webmcp_set_theme_switched(inputs)
});