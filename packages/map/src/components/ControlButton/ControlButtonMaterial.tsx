import type { ComponentProps } from "react";
import { forwardRef, useLayoutEffect, useRef } from "react";
import { normalizeAriaBooleanProps } from "../md/ariaProps";
import { MdFilledTonalButton, MdTextButton } from "../md/MdButton";
import { MdFilledTonalIconButton, MdIconButton } from "../md/MdIconButton";
import type { ControlButtonProps } from "./ControlButton";
import styles from "./ControlButton.module.css";

/**
 * The real `@material/web`-backed implementation behind `ControlButton`.
 *
 * @remarks
 * Lives in its own module, dynamically `import()`ed client-side only from
 * `ControlButton` (see that module's docs for why not `React.lazy()`),
 * because merely *importing* `@material/web`'s custom element classes
 * throws (`ReferenceError: HTMLElement is not defined`) under Cloudflare
 * Workers' SSR environment — Lit's package exports resolve to a
 * browser-targeted build there (workerd's `resolve.conditions` includes
 * `"browser"` but not `"node"`, and `"browser"` sorts first in Lit's own
 * `exports` map), unlike plain Node which resolves Lit's Node-safe
 * `HTMLElement` shim instead. Keeping this module out of the eagerly
 * SSR'd import graph (the same reason `@karta/map/MapView` is lazy — see
 * `packages/map/src/index.ts`) sidesteps the crash entirely, verified via
 * `wrangler dev` against a real build, not just inferred. `shape`/
 * `variant` together pick one of four `md-*` elements: `"icon"` +
 * `"surface"` → `<md-filled-tonal-icon-button>`, `"icon"` + `"embedded"` →
 * `<md-icon-button>`, `"pill"` + `"surface"` → `<md-filled-tonal-button>`,
 * `"pill"` + `"embedded"` → `<md-text-button>`.
 */
const ControlButtonMaterial = forwardRef<HTMLElement, ControlButtonProps>(
  function ControlButtonMaterial(
    {
      children,
      className,
      label,
      shape = "icon",
      variant = "surface",
      ...props
    },
    ref,
  ) {
    const resolvedClassName = className
      ? `${styles.button} ${className}`
      : styles.button;

    const internalRef = useRef<(HTMLElement & { type?: string }) | null>(null);
    /**
     * `@lit/react`'s `useLayoutEffect`-based property assignment (see
     * node_modules/@lit/react/create-component.js) doesn't reliably win
     * against Material's own form-submitter mixin, which defaults `type`
     * to `"submit"` in its constructor — in practice the element ends up
     * `"submit"` regardless of the `type="button"` prop passed below, at
     * least under this project's happy-dom test environment. Setting the
     * property directly, one commit later, is a verified-working
     * workaround (unlike the prop-based path) that guarantees these
     * controls never trigger an accidental form submission.
     */
    useLayoutEffect(() => {
      if (internalRef.current) {
        internalRef.current.type = "button";
      }
    });
    const setRefs = (node: HTMLElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    /**
     * All four `md-*` wrapper components accept the same runtime shape
     * (standard HTML attributes plus `aria-label`/`type`, forwarded
     * verbatim to the underlying custom element); only their generated
     * TypeScript types differ per element class, since each wraps a
     * distinct Material custom element. The per-branch cast below
     * reflects that real runtime compatibility, which `@lit/react`'s
     * per-component types don't statically express across sibling
     * wrapper components, rather than papering over an actual type error.
     *
     * `aria-label` (the literal HTML attribute, not the `ariaLabel` JS
     * property) is used deliberately: `@lit/react` only property-assigns a
     * prop when its exact key exists on the element's prototype, and
     * `ariaLabel` only appears there via the browser's native ARIAMixin
     * reflection (`Element.prototype.ariaLabel`) — unimplemented in
     * happy-dom, and not something to depend on over the attribute every
     * environment (including Material's own `aria-label` attribute
     * handling internally) already supports directly.
     */
    const commonProps = {
      ref: setRefs,
      className: resolvedClassName,
      "data-shape": shape,
      "data-variant": variant,
      "aria-label": label,
      type: "button" as const,
      ...normalizeAriaBooleanProps(props),
    };

    if (shape === "pill" && variant === "embedded") {
      return (
        <MdTextButton {...(commonProps as ComponentProps<typeof MdTextButton>)}>
          {children}
        </MdTextButton>
      );
    }

    if (shape === "pill") {
      return (
        <MdFilledTonalButton
          {...(commonProps as ComponentProps<typeof MdFilledTonalButton>)}
        >
          {children}
        </MdFilledTonalButton>
      );
    }

    if (variant === "embedded") {
      return (
        <MdIconButton {...(commonProps as ComponentProps<typeof MdIconButton>)}>
          {children}
        </MdIconButton>
      );
    }

    return (
      <MdFilledTonalIconButton
        {...(commonProps as ComponentProps<typeof MdFilledTonalIconButton>)}
      >
        {children}
      </MdFilledTonalIconButton>
    );
  },
);

export default ControlButtonMaterial;
