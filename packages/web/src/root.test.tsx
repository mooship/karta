import { render, screen } from "@testing-library/react";
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

  it("leaves stylesheets to the bundler's own route-module CSS links", () => {
    expect(
      links().filter((link) => "rel" in link && link.rel === "stylesheet"),
    ).toHaveLength(0);
  });
});

describe("root meta", () => {
  it("sets the page title, description, and viewport", () => {
    const tags = meta({} as never);

    expect(tags).toContainEqual({ title: "Karta" });
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
});

describe("root Layout", () => {
  it("renders the document shell around its children", () => {
    const markup = renderToStaticMarkup(
      createElement(Layout, null, createElement("p", null, "app content")),
    );

    expect(markup).toContain('<html lang="en">');
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
    expect(
      screen.getByRole("button", { name: "Reload page" }),
    ).toBeInTheDocument();
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
