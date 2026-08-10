import { createComponent } from "@lit/react";
import { MdFilledTonalIconButton as FilledTonalIconButtonElement } from "@material/web/iconbutton/filled-tonal-icon-button.js";
import { MdIconButton as IconButtonElement } from "@material/web/iconbutton/icon-button.js";
import * as React from "react";

/**
 * React wrapper for `<md-icon-button>` (M3's standard, transparent icon
 * button) via `@lit/react`. Used for {@link ControlButtonVariant} `"embedded"`.
 *
 * @remarks
 * Importing `@material/web`'s custom element classes is SSR-safe: Lit
 * resolves to a Node-safe `HTMLElement` shim (rather than the browser
 * global) under Node/Workers' `"node"`/`"import"` package export
 * conditions, so this module can sit in `@karta/map`'s eagerly-imported
 * barrel — used directly by `App.tsx`, not behind `MapView`'s `lazy()`
 * boundary — without crashing React Router's SSR render. The element's
 * real Material chrome (ripple, shape, elevation) only paints in once the
 * browser executes the custom element's registration/upgrade after
 * hydration.
 */
export const MdIconButton = createComponent({
  react: React,
  tagName: "md-icon-button",
  elementClass: IconButtonElement,
});

/** React wrapper for `<md-filled-tonal-icon-button>` (M3's tonal, elevated icon button), used for {@link ControlButtonVariant} `"surface"`. */
export const MdFilledTonalIconButton = createComponent({
  react: React,
  tagName: "md-filled-tonal-icon-button",
  elementClass: FilledTonalIconButtonElement,
});
