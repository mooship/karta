import { configure } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// The first test in a file waits for App's lazy MapView import, which a loaded machine can take over a second to transform.
configure({ asyncUtilTimeout: 5000 });

afterEach(() => {
  window.history.replaceState(null, "", "/");
});
