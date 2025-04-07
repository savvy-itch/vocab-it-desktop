import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("./layout.tsx", [
    index("routes/home.tsx"),
    route("vocabularies/:vocabId", "routes/vocab.tsx"),
    route("lesson/:vocabId", "routes/lesson.tsx"),
  ])
] satisfies RouteConfig;
