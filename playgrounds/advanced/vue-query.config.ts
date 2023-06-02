import { createHooks } from "@wundergraph/vue-query"

export default defineVueQueryPluginCallback(async ({ queryClient }) => {
  queryClient.setQueryData(["todos"], [{ id: 1, todo: "Hello" }, { id: 2, todo: "World" }])
  return { provide: { createHooks, test: console } }
})
