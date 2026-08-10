import {
  type ButtonHTMLAttributes,
  type ComponentType,
  forwardRef,
  type ReactNode,
  type RefAttributes,
  useEffect,
  useState,
} from "react";
import styles from "./ControlButton.module.css";

/** Visual shape of a `ControlButton`. */
export type ControlButtonShape = "icon" | "pill";
/** Visual emphasis of a `ControlButton`. */
export type ControlButtonVariant = "surface" | "embedded";

/** Props for `ControlButton`. */
export interface ControlButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> {
  children: ReactNode;
  /**
   * Sets the button's accessible name, overriding any visible text in
   * `children`. Pass this for icon-only buttons; for a button whose
   * visible text should itself be the accessible name, omit it.
   */
  label?: string;
  shape?: ControlButtonShape;
  variant?: ControlButtonVariant;
}

type MaterialComponent = ComponentType<
  ControlButtonProps & RefAttributes<HTMLElement>
>;

let cachedMaterialComponent: MaterialComponent | undefined;

/**
 * A plain `<button>` rendered until {@link ControlButtonMaterial} has
 * loaded and mounted client-side. Carries its own hand-rolled chrome —
 * border, tonal background, shape, elevation — matching the M3 tokens,
 * since Material's real chrome isn't available yet at this point; a real
 * `md-*` element replaces it in place once ready, with no layout shift
 * (both share the same `--control-height`-driven box).
 */
const ControlButtonFallback = forwardRef<HTMLButtonElement, ControlButtonProps>(
  function ControlButtonFallback(
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
      ? `${styles.button} ${styles.fallback} ${className}`
      : `${styles.button} ${styles.fallback}`;

    return (
      <button
        ref={ref}
        type="button"
        className={resolvedClassName}
        data-shape={shape}
        data-variant={variant}
        aria-label={label}
        {...props}
      >
        {children}
      </button>
    );
  },
);

/**
 * The base Material 3 button used by every map control (icon buttons, pill
 * toggles, etc.), built on real `@material/web` custom elements.
 *
 * @remarks
 * Renders {@link ControlButtonFallback} (a plain `<button>`) on the server
 * and on the client's first render, then swaps to the real
 * `@material/web`-backed implementation (`./ControlButtonMaterial`) once
 * mounted — loaded via a plain `import()` in a `useEffect`, not
 * `React.lazy()`/`Suspense`. `React.lazy` assumes the server and client
 * attempt the *same* dynamic import during hydration and reconciles
 * around that; here the server-side import can never even be attempted
 * (importing `@material/web`'s custom element classes throws
 * `ReferenceError: HTMLElement is not defined` under Cloudflare Workers'
 * SSR — Lit's package exports resolve to a browser-targeted build there,
 * verified via `wrangler dev`, not merely inferred), so client and server
 * are structurally asymmetric in a way `React.lazy` doesn't expect,
 * producing a hydration mismatch (React error #419) in practice. Gating
 * the import behind `useEffect` instead guarantees the first client
 * render matches the server's fallback markup exactly — no mismatch is
 * possible — and the swap to real Material chrome happens as an ordinary
 * post-hydration update. The ref forwards to whichever element is
 * currently rendered (`HTMLElement` covers both the fallback `<button>`
 * and the real custom element); `.focus()` and DOM containment checks
 * work identically either way.
 */
export const ControlButton = forwardRef<HTMLElement, ControlButtonProps>(
  function ControlButton(props, ref) {
    const [MaterialComponent, setMaterialComponent] = useState<
      MaterialComponent | undefined
    >(cachedMaterialComponent);

    useEffect(() => {
      if (MaterialComponent) {
        return;
      }
      let cancelled = false;
      import("./ControlButtonMaterial").then((module) => {
        cachedMaterialComponent = module.default;
        if (!cancelled) {
          setMaterialComponent(() => module.default);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [MaterialComponent]);

    if (MaterialComponent) {
      return <MaterialComponent ref={ref} {...props} />;
    }
    return <ControlButtonFallback ref={ref as never} {...props} />;
  },
);
