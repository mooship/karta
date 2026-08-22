import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("privacy", "./routes/privacy.tsx"),
  route("robots.txt", "./routes/robots.txt.ts"),
  route("sitemap.xml", "./routes/sitemap.xml.ts"),
  route("llms.txt", "./routes/llms.txt.ts"),
] satisfies RouteConfig;
