// `MapView` is intentionally NOT re-exported here: it pulls in Leaflet and
// react-leaflet, and consumers that code-split it behind `lazy()`/`import()`
// need `@karta/map/MapView` (see package.json `exports`) to keep that
// bundle boundary — re-exporting it from this barrel would make it
// statically reachable from any import of this module, defeating the split.
export { BasemapToggle } from "./components/BasemapToggle/BasemapToggle";
export type {
  ControlButtonProps,
  ControlButtonShape,
  ControlButtonVariant,
} from "./components/ControlButton/ControlButton";
export { ControlButton } from "./components/ControlButton/ControlButton";
export { DesktopLegend } from "./components/DesktopLegend/DesktopLegend";
export { IconButton } from "./components/IconButton/IconButton";
export { Legend } from "./components/Legend/Legend";
export type { SelectableFeatureSearchEntry } from "./components/LocationSearchControl/LocationSearchControl";
export { LocationSearchControl } from "./components/LocationSearchControl/LocationSearchControl";
export type {
  MeasurementControlProps,
  MeasurementMode,
} from "./components/MeasurementControl/MeasurementControl";
export { MeasurementControl } from "./components/MeasurementControl/MeasurementControl";
export { MobileLegend } from "./components/MobileLegend/MobileLegend";
export type { SegmentedControlOption } from "./components/SegmentedControl/SegmentedControl";
export { SegmentedControl } from "./components/SegmentedControl/SegmentedControl";
export { SettingsMenu } from "./components/SettingsMenu/SettingsMenu";
export { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
export type {
  Basemap,
  BasemapDefinition,
  BasemapTileSource,
  RasterBasemapDefinition,
  VectorBasemapDefinition,
} from "./constants/basemaps";
export {
  getBasemapDefinition,
  getBasemapTileSources,
  getRegisteredBasemapIds,
  registerBasemap,
  resetBasemapRegistry,
  resolveTileScaleToken,
} from "./constants/basemaps";
export { AREA_OUTLINE } from "./constants/mapStyles";
export type { MobileLayoutCssVar } from "./constants/mobileLayoutTokens";
export { MOBILE_LAYOUT_CSS_VAR_DEFAULTS } from "./constants/mobileLayoutTokens";
export type { DomainRegistry } from "./context/DomainContext";
export { DomainProvider, useDomain } from "./context/DomainContext";
export type {
  GeocoderProvider,
  LocationSearchResult,
  NominatimSearchOptions,
} from "./data/locationSearch";
export {
  createNominatimGeocoderProvider,
  fetchLocationSearchResults,
  fetchReverseGeocodeResult,
  nominatimGeocoderProvider,
} from "./data/locationSearch";
export type { UseDismissableOverlayOptions } from "./hooks/useDismissableOverlay";
export { useDismissableOverlay } from "./hooks/useDismissableOverlay";
export type { LayerDataMap, LayerDataResult } from "./hooks/useLayerData";
export { useLayerData } from "./hooks/useLayerData";
