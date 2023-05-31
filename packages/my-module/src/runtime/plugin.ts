import { useSomething } from "./composables/useSomething"
import { defineNuxtPlugin, useRuntimeConfig } from "#imports"

export default defineNuxtPlugin(async () => {
  const { something } = useSomething()

  const config = useRuntimeConfig()

  if (config)
    // eslint-disable-next-line no-console
    console.log(something)
})
