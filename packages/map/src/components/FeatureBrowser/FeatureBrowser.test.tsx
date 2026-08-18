import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FeatureBrowser } from "./FeatureBrowser";

const groupedEntries = [
  { id: "a", label: "Alexandra", groupId: "jhb", groupLabel: "Johannesburg" },
  { id: "b", label: "Soweto", groupId: "jhb", groupLabel: "Johannesburg" },
  { id: "c", label: "Mamelodi", groupId: "tsh", groupLabel: "Tshwane" },
  { id: "d", label: "Atteridgeville", groupId: "tsh", groupLabel: "Tshwane" },
];

const flatEntries = [
  { id: "a", label: "Alexandra" },
  { id: "b", label: "Soweto" },
  { id: "c", label: "Mamelodi" },
];

describe("FeatureBrowser", () => {
  it("renders every entry's label", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("option", { name: "Alexandra" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Soweto" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Mamelodi" }),
    ).toBeInTheDocument();
  });

  it("calls onSelect with the clicked entry's id", () => {
    const onSelect = vi.fn();
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole("option", { name: "Soweto" }));

    expect(onSelect).toHaveBeenCalledWith("b");
  });

  it("marks the entry matching selectedId as selected", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        selectedId="b"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole("option", { name: "Soweto" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("option", { name: "Alexandra" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("renders no group headings when no entry declares a group", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("groups entries under their groupLabel, preserving first-seen group order", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={groupedEntries}
        onSelect={vi.fn()}
      />,
    );

    const groups = screen.getAllByRole("group");
    expect(groups).toHaveLength(2);
    expect(screen.getByText("Johannesburg")).toBeInTheDocument();
    expect(screen.getByText("Tshwane")).toBeInTheDocument();
  });

  it("moves roving focus to the next entry on ArrowDown, and back on ArrowUp", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={vi.fn()}
      />,
    );

    const first = screen.getByRole("option", { name: "Alexandra" });
    const second = screen.getByRole("option", { name: "Soweto" });
    first.focus();
    expect(first).toHaveAttribute("tabIndex", "0");
    expect(second).toHaveAttribute("tabIndex", "-1");

    fireEvent.keyDown(first, { key: "ArrowDown" });
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute("tabIndex", "0");
    expect(first).toHaveAttribute("tabIndex", "-1");

    fireEvent.keyDown(second, { key: "ArrowUp" });
    expect(first).toHaveFocus();
  });

  it("crosses group boundaries when moving with the arrow keys", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={groupedEntries}
        onSelect={vi.fn()}
      />,
    );

    const lastOfFirstGroup = screen.getByRole("option", { name: "Soweto" });
    const firstOfSecondGroup = screen.getByRole("option", { name: "Mamelodi" });
    lastOfFirstGroup.focus();

    fireEvent.keyDown(lastOfFirstGroup, { key: "ArrowDown" });

    expect(firstOfSecondGroup).toHaveFocus();
  });

  it("jumps to the first and last entries with Home and End", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={vi.fn()}
      />,
    );

    const first = screen.getByRole("option", { name: "Alexandra" });
    const last = screen.getByRole("option", { name: "Mamelodi" });
    first.focus();

    fireEvent.keyDown(first, { key: "End" });
    expect(last).toHaveFocus();

    fireEvent.keyDown(last, { key: "Home" });
    expect(first).toHaveFocus();
  });

  it("moves focus to the next entry whose label starts with the typed character", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={vi.fn()}
      />,
    );

    const first = screen.getByRole("option", { name: "Alexandra" });
    const soweto = screen.getByRole("option", { name: "Soweto" });
    first.focus();

    fireEvent.keyDown(first, { key: "s" });

    expect(soweto).toHaveFocus();
  });

  it("selects the focused entry on Enter", () => {
    const onSelect = vi.fn();
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={onSelect}
      />,
    );

    const soweto = screen.getByRole("option", { name: "Soweto" });
    soweto.focus();
    fireEvent.keyDown(soweto, { key: "Enter" });

    expect(onSelect).toHaveBeenCalledWith("b");
  });

  it("offers no search input by default", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("filters entries by label as the search input changes", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={vi.fn()}
        searchable
        searchPlaceholder="Search townships"
      />,
    );

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "so" },
    });

    expect(screen.getByRole("option", { name: "Soweto" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Alexandra" }),
    ).not.toBeInTheDocument();
  });

  it("shows the empty message when a search matches nothing", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={vi.fn()}
        searchable
        emptyMessage="No matches"
      />,
    );

    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "zzz" },
    });

    expect(screen.getByText("No matches")).toBeInTheDocument();
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("keeps the search input usable while showing the empty message", () => {
    render(
      <FeatureBrowser
        ariaLabel="Browse townships"
        entries={flatEntries}
        onSelect={vi.fn()}
        searchable
        emptyMessage="No matches"
      />,
    );

    const search = screen.getByRole("searchbox");
    fireEvent.change(search, { target: { value: "zzz" } });
    fireEvent.change(search, { target: { value: "" } });

    expect(screen.queryByText("No matches")).not.toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Alexandra" }),
    ).toBeInTheDocument();
  });
});
