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

  it("defaults to data-panel-open=false when panelOpen is omitted", () => {
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

    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-panel-open",
      "false",
    );
  });

  it("collapses to the idle toggle when panelOpen is true, even mid-measurement", () => {
    render(
      <MeasurementControl
        active
        mode="distance"
        pointCount={2}
        resultLabel="1.2 km"
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
        panelOpen
      />,
    );

    expect(
      screen.getByTestId("measurement-control-toggle"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("measurement-control-panel"),
    ).not.toBeInTheDocument();
  });

  it("calls onRequestPanelClose, not onToggleActive, when the idle toggle is tapped while panelOpen is true", () => {
    const onToggleActive = vi.fn();
    const onRequestPanelClose = vi.fn();
    render(
      <MeasurementControl
        active
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={onToggleActive}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
        panelOpen
        onRequestPanelClose={onRequestPanelClose}
      />,
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));

    expect(onRequestPanelClose).toHaveBeenCalled();
    expect(onToggleActive).not.toHaveBeenCalled();
  });

  it("does not fall back to onToggleActive when onRequestPanelClose is omitted while panelOpen is true", () => {
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
        panelOpen
      />,
    );

    fireEvent.click(screen.getByTestId("measurement-control-toggle"));

    expect(onToggleActive).not.toHaveBeenCalled();
  });

  it("uses custom copy for the toggle, panel, mode options, hint and clear button when given", () => {
    const { rerender } = render(
      <MeasurementControl
        active={false}
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
        toggleLabel="Meet afstand en area"
        backToMapLabel="Terug na kaart"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Meet afstand en area" }),
    ).toBeInTheDocument();

    rerender(
      <MeasurementControl
        active
        mode="distance"
        pointCount={2}
        resultLabel="1.2 km"
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
        ariaLabel="Meetnutsding"
        title="Meet"
        stopLabel="Stop met meet"
        modeLabel="Meetmodus"
        distanceModeLabel="Afstand"
        areaModeLabel="Area"
        clearLabel="Maak skoon"
      />,
    );

    expect(
      screen.getByRole("region", { name: "Meetnutsding" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Meet")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Stop met meet" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Meetmodus" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Afstand")).toBeInTheDocument();
    expect(screen.getByText("Area")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Maak skoon" }),
    ).toBeInTheDocument();

    rerender(
      <MeasurementControl
        active
        mode="distance"
        pointCount={0}
        resultLabel={null}
        onToggleActive={vi.fn()}
        onModeChange={vi.fn()}
        onClear={vi.fn()}
        hint="Klik op die kaart om te begin meet."
      />,
    );

    expect(
      screen.getByText("Klik op die kaart om te begin meet."),
    ).toBeInTheDocument();
  });

  it("reflects panelOpen as data-panel-open, on both the inactive and active render", () => {
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
      />,
    );

    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-panel-open",
      "true",
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
      />,
    );

    expect(screen.getByTestId("measurement-control-root")).toHaveAttribute(
      "data-panel-open",
      "true",
    );
  });
});
