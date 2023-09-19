import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  entries: ["src/module"],
  externals: ["@tanstack/vue-query"],
  declaration: true,
  rollup: {
    emitCJS: true
  }
})
