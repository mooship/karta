/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ layerId: NonNullable<unknown> }} Webmcp_Toggle_Layer_UnknownInputs */



/**
* | output |
* | --- |
* | "No layer with id \"{layerId}\". Call list-map-layers to see valid ids." |
*
* @param {Webmcp_Toggle_Layer_UnknownInputs} inputs
* @param {{ locale?: "en" | "af" }} options
* @returns {LocalizedString}
*/
export const webmcp_toggle_layer_unknown = /** @type {((inputs: Webmcp_Toggle_Layer_UnknownInputs, options?: { locale?: "en" | "af" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Webmcp_Toggle_Layer_UnknownInputs, { locale?: "en" | "af" }, {}>} */ ((i, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "af") return /** @type {LocalizedString} */ (`Geen laag met id "${i?.layerId}" nie. Roep list-map-layers om geldige id's te sien.`)
	return /** @type {LocalizedString} */ (`No layer with id "${i?.layerId}". Call list-map-layers to see valid ids.`)
});