import { fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoutesStub } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { getLayers } from "./layers/registry";

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    Meta: () => null,
    Links: () => null,
    Scripts: () => null,
    ScrollRestoration: () => null,
  };
});

const {
  default: Root,
  Layout,
  links,
  meta,
  ErrorBoundary,
} = await import("./root");

describe("root links", () => {
  it("does not preload any layer GeoJSON, so it never competes with render-critical requests", () => {
    const layerDataUrls = new Set(
      getLayers().flatMap((layer) =>
        layer.companionSource
          ? [...layer.dataSource, layer.companionSource]
          : layer.dataSource,
      ),
    );

    expect(layerDataUrls.size).toBeGreaterThan(0);

    const hrefs = links().map((link) => ("href" in link ? link.href : ""));
    for (const url of layerDataUrls) {
      expect(hrefs).not.toContain(url);
    }
    expect(
      links().filter((link) => "rel" in link && link.rel === "preload"),
    ).toHaveLength(0);
  });

  it("still emits the icon, manifest and preconnect links", () => {
    const rels = links().map((link) => ("rel" in link ? link.rel : ""));

    expect(rels).toContain("icon");
    expect(rels).toContain("manifest");
    expect(rels).toContain("preconnect");
  });

  it("preconnects to the default vector basemap's tile host, not just the raster fallbacks", () => {
    const hrefs = links()
      .filter((link) => "rel" in link && link.rel === "preconnect")
      .map((link) => ("href" in link ? link.href : ""));

    expect(hrefs).toContain("https://tiles.openfreemap.org");
  });

  it("leaves the canonical link to each leaf route, since a shared one here would apply to every page", () => {
    const rels = links().map((link) => ("rel" in link ? link.rel : ""));

    expect(rels).not.toContain("canonical");
  });

  it("leaves stylesheets to the bundler's own route-module CSS links", () => {
    expect(
      links().filter((link) => "rel" in link && link.rel === "stylesheet"),
    ).toHaveLength(0);
  });
});

describe("root meta", () => {
  it("sets the page title, description, and viewport", () => {
    const tags = meta({} as never);

    expect(tags).toContainEqual({ title: "Karta: Gauteng spatial legacy map" });
    expect(tags).toContainEqual(
      expect.objectContaining({ name: "description" }),
    );
    expect(tags).toContainEqual(
      expect.objectContaining({
        name: "viewport",
        content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
      }),
    );
  });

  it("sets Open Graph and Twitter card tags pointing at an absolute, sized og-image", () => {
    const tags = meta({} as never);

    expect(tags).toContainEqual({ property: "og:type", content: "website" });
    expect(tags).toContainEqual(
      expect.objectContaining({ property: "og:title" }),
    );
    expect(tags).toContainEqual(
      expect.objectContaining({ property: "og:description" }),
    );
    expect(tags).toContainEqual({
      property: "og:url",
      content: "https://karta.timothybrits.co.za",
    });
    expect(tags).toContainEqual({
      property: "og:image",
      content: "https://karta.timothybrits.co.za/og-image.png",
    });
    expect(tags).toContainEqual({
      property: "og:image:width",
      content: "1200",
    });
    expect(tags).toContainEqual({
      property: "og:image:height",
      content: "630",
    });
    expect(tags).toContainEqual({
      name: "twitter:card",
      content: "summary_large_image",
    });
    expect(tags).toContainEqual(
      expect.objectContaining({ name: "twitter:image" }),
    );
  });

  it("declares an og:locale for the current locale, and an alternate for every other configured locale", () => {
    const tags = meta({} as never);

    expect(tags).toContainEqual({ property: "og:locale", content: "en_ZA" });
    expect(tags).toContainEqual({
      property: "og:locale:alternate",
      content: "af_ZA",
    });
  });

  it("emits Dataset JSON-LD structured data describing the site", () => {
    const tags = meta({} as never);
    const jsonLdTag = tags.find((tag) => "script:ld+json" in tag) as
      | { "script:ld+json": Record<string, unknown> }
      | undefined;

    expect(jsonLdTag).toBeDefined();
    expect(jsonLdTag?.["script:ld+json"]).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Dataset",
      url: "https://karta.timothybrits.co.za",
    });
  });
});

describe("root Layout", () => {
  it("renders the document shell around its children", () => {
    const markup = renderToStaticMarkup(
      createElement(Layout, null, createElement("p", null, "app content")),
    );

    expect(markup).toContain('<html lang="en" dir="ltr">');
    expect(markup).toContain("app content");
    expect(markup).not.toContain('src="/theme-bootstrap.js"');
    expect(markup).toContain('localStorage.getItem("buffer-zones-theme")');
    expect(markup).toContain('media="(prefers-color-scheme: light)"');
    expect(markup).toContain('media="(prefers-color-scheme: dark)"');
  });
});

describe("root ErrorBoundary", () => {
  it("renders a fallback message and a reload action when a descendant throws", () => {
    const Boom = () => {
      throw new Error("kaboom");
    };
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: Root,
        ErrorBoundary,
        children: [{ index: true, Component: Boom }],
      },
    ]);

    render(createElement(Stub, { initialEntries: ["/"] }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    const reloadButton = screen.getByRole("button", { name: "Reload page" });
    expect(reloadButton).toBeInTheDocument();

    const reload = vi.fn();
    vi.stubGlobal("location", { ...window.location, reload });
    fireEvent.click(reloadButton);
    expect(reload).toHaveBeenCalledTimes(1);
    vi.unstubAllGlobals();
  });

  it("renders a not-found message for an unmatched route", () => {
    const Stub = createRoutesStub([
      { path: "/", Component: Root, ErrorBoundary },
    ]);

    render(
      createElement(Stub, { initialEntries: ["/this-page-does-not-exist"] }),
    );

    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
  });
});

describe("root Root", () => {
  it("renders the matched child route via Outlet", () => {
    const Stub = createRoutesStub([
      {
        path: "/",
        Component: Root,
        children: [
          {
            index: true,
            Component: () => createElement("p", null, "child route"),
          },
        ],
      },
    ]);

    render(createElement(Stub, { initialEntries: ["/"] }));

    expect(screen.getByText("child route")).toBeInTheDocument();
  });
});
