import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("d/:domainId", "./routes/domain.tsx"),
  route("privacy", "./routes/privacy.tsx"),
] satisfies RouteConfig;
