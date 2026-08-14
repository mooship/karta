import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MeasurementControl } from "./MeasurementControl";

describe("MeasurementControl", () => {
  it("renders only a toggle button when inactive", () => {
    render(
      <MeasurementControl
        active={false}
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(
      screen.getByTestId("measurement-control-toggle"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("measurement-control-panel"),
    ).not.toBeInTheDocument();
  });

  it("calls onToggleActive when the toggle button is clicked", () => {
    const onToggleActive = vi.fn();
    render(
      <MeasurementControl
        active={false}
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={onToggleActive}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));

    expect(onToggleActive).toHaveBeenCalled();
  });

  it("shows the panel with a mode switch and a hint when active with no points yet", () => {
    render(
      <MeasurementControl
        active
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByTestId("measurement-control-panel")).toBeInTheDocument();
    expect(screen.getByTestId("measurement-control-hint")).toBeInTheDocument();
    expect(
      screen.queryByTestId("measurement-control-result"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("measurement-control-clear"),
    ).not.toBeInTheDocument();
  });

  it("shows the result readout and a clear button once there are points", () => {
    render(
      <MeasurementControl
        active
        mode="distance"
        pointCount={2}
        resultLabel="1.2 km"
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByTestId("measurement-control-result")).toHaveTextContent(
      "1.2 km",
    );
    expect(screen.getByTestId("measurement-control-clear")).toBeInTheDocument();
    expect(
      screen.queryByTestId("measurement-control-hint"),
    ).not.toBeInTheDocument();
  });

  it("calls onClear when the clear button is clicked", () => {
    const onClear = vi.fn();
    render(
      <MeasurementControl
        active
        mode="distance"
        pointCount={2}
        resultLabel="1.2 km"
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByTestId("measurement-control-clear"));

    expect(onClear).toHaveBeenCalled();
  });

  it("calls onModeChange with the newly selected mode", () => {
    const onModeChange = vi.fn();
    render(
      <MeasurementControl
        active
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={onModeChange}
        onClear={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("measurement-control-mode-option-area"));

    expect(onModeChange).toHaveBeenCalledWith("area");
  });

  it("calls onToggleActive (to deactivate) when the panel's close button is clicked", () => {
    const onToggleActive = vi.fn();
    render(
      <MeasurementControl
        active
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={onToggleActive}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId("measurement-control-close"));

    expect(onToggleActive).toHaveBeenCalled();
  });

  it("defaults to data-panel-open=false and data-panel-size=medium when panelOpen/panelExpanded are omitted", () => {
    render(
      <MeasurementControl
        active
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    const root = screen.getByTestId("measurement-control-root");
    expect(root).toHaveAttribute("data-panel-open", "false");
    expect(root).toHaveAttribute("data-panel-size", "medium");
  });

  it("reflects panelOpen and panelExpanded as data-panel-open/data-panel-size, on both the inactive and active render", () => {
    const { rerender } = render(
      <MeasurementControl
        active={false}
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
        panelOpen
        panelExpanded
      />,
    );

    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-panel-open",
      "true",
    );
    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-panel-size",
      "full",
    );

    rerender(
      <MeasurementControl
        active
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
        panelOpen
        panelExpanded={false}
      />,
    );

    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-panel-open",
      "true",
    );
    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-panel-size",
      "medium",
    );
  });

  it("reflects active as data-active on the root, on both the inactive and active render", () => {
    const { rerender } = render(
      <MeasurementControl
        active={false}
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-active",
      "false",
    );

    rerender(
      <MeasurementControl
        active
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
      />,
    );

    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-active",
      "true",
    );
  });
});
