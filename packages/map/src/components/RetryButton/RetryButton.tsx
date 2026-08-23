import type { ButtonHTMLAttributes } from "react";
import * as styles from "./RetryButton.css";

/** Props for {@link RetryButton}. */
export interface RetryButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
  /** Visible button text. Defaults to `"Retry"`. */
  label?: string;
}

/**
 * A small inline text button for retrying a failed request, styled to sit
 * beside an error message inside a status line.
 * @remarks Shared by `LocationSearchControl` and `LocationContextMenu`, whose
 *   retry affordances previously duplicated the same styling independently.
 *   Text is deliberately hardcoded English, matching this package's other
 *   chrome: `@karta/map` has no access to a caller's translation catalogue.
 */
export function RetryButton({
  label = "Retry",
  className,
  ...props
}: RetryButtonProps) {
  return (
    <button
      type="button"
      className={className ? `${styles.button} ${className}` : styles.button}
      {...props}
    >
      {label}
    </button>
  );
}
