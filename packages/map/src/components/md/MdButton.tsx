import { createComponent } from "@lit/react";
import { MdFilledTonalButton as FilledTonalButtonElement } from "@material/web/button/filled-tonal-button.js";
import { MdTextButton as TextButtonElement } from "@material/web/button/text-button.js";
import * as React from "react";

/**
 * React wrapper for `<md-filled-tonal-button>` (M3's tonal, elevated pill
 * button with an optional leading icon), used for {@link ControlButtonVariant}
 * `"surface"` at {@link ControlButtonShape} `"pill"`. See
 * {@link MdIconButton} for the SSR-safety rationale shared by every `md/`
 * wrapper.
 */
export const MdFilledTonalButton = createComponent({
  react: React,
  tagName: "md-filled-tonal-button",
  elementClass: FilledTonalButtonElement,
});

/** React wrapper for `<md-text-button>` (M3's transparent, ghost pill button), used for {@link ControlButtonVariant} `"embedded"` at {@link ControlButtonShape} `"pill"`. */
export const MdTextButton = createComponent({
  react: React,
  tagName: "md-text-button",
  elementClass: TextButtonElement,
});
