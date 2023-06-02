import { createHooks } from "@wundergraph/vue-query"

export default defineVueQueryPluginCallback(() => {
  return { provide: { createHooks, test: console } }
})
