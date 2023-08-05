import { createHooks } from "@wundergraph/vue-query"

export default defineVueQueryPluginHook(({ queryClient, nuxt }) => {
  nuxt.vueApp.use({ install: () => { } })
  queryClient.setQueryData(["todos"], [{ id: 1, todo: "Hello" }, { id: 2, todo: "World" }])
  return { pluginReturn: { provide: { createHooks, test: console } } }
})
