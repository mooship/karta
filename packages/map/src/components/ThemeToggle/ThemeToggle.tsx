import type { ThemePreference } from "@karta/react";
import { SegmentedControl } from "../SegmentedControl/SegmentedControl";

interface ThemeToggleProps {
  preference: ThemePreference;
  onChange: (preference: ThemePreference) => void;
}

const THEME_OPTIONS: {
  id: ThemePreference;
  label: string;
  ariaLabel: string;
}[] = [
  { id: "system", label: "System", ariaLabel: "System theme" },
  { id: "light", label: "Light", ariaLabel: "Light theme" },
  { id: "dark", label: "Dark", ariaLabel: "Dark theme" },
];

/** A `SegmentedControl` for choosing between system/light/dark theme preference. */
export function ThemeToggle({ preference, onChange }: ThemeToggleProps) {
  return (
    <SegmentedControl
      label="Theme"
      options={THEME_OPTIONS}
      value={preference}
      onChange={onChange}
      testId="theme"
    />
  );
}
