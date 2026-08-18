declare global {
  interface Navigator {
    /** Global Privacy Control (https://globalprivacycontrol.org/), a signal some privacy-focused browsers/extensions set. Not yet part of the DOM lib types `navigator.doNotTrack` already is. */
    globalPrivacyControl?: boolean;
  }
}

/**
 * Whether the browser signals Do Not Track or Global Privacy Control.
 * @remarks Used to skip sending layer-usage beacons entirely for a visitor
 *   who's explicitly opted out of tracking — even though this app's beacons
 *   already carry no personal data, honouring the signal costs nothing and
 *   respects its intent.
 */
export function isDoNotTrackEnabled(): boolean {
  return (
    navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true
  );
}
