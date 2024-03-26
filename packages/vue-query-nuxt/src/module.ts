import { relative, resolve } from 'node:path'
import { existsSync } from "node:fs"
import { addImports, addPlugin, addTemplate, addTypeTemplate, createResolver, defineNuxtModule, updateTemplates, useLogger } from "@nuxt/kit"
import { defu } from "defu"
import { generateCode, loadFile } from "magicast"
import { transform } from "esbuild"
import type { ModuleOptions } from "./runtime/utils"
import { NAME, configKey, defaults } from "./runtime/utils"

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: NAME,
    configKey,
    compatibility: {
      nuxt: "^3"
    }
  },
  defaults,
  async setup(userOptions, nuxt) {
    const logger = useLogger(NAME)
    const { resolve } = createResolver(import.meta.url)

    logger.info(`Adding ${NAME} module...`)

    // 1. Set up runtime configuration
    nuxt.options.runtimeConfig.public[configKey] = defu(nuxt.options.runtimeConfig.public[configKey], userOptions, {})

    // 2. Add plugin
    addPlugin(resolve("./runtime/plugin"))

    // 3. Add composable
    addImports([{ name: "defineVueQueryPluginHook", from: resolve("./runtime/composables/defineVueQueryPluginHook") }])

    const filename = "internal.vue-query-plugin-hook.mjs"

    // 4. Write pluginHook() to .nuxt
    addTemplate({
      filename,
      write: true,
      getContents: async () => {
        if (existsSync(resolve(nuxt.options.rootDir, "vue-query.config.ts"))) {
          const configFile = resolve(nuxt.options.rootDir, "vue-query.config.ts")
          const file = await loadFile(configFile)
          if (file.exports.pluginHook || file.exports.default) {
            logger.success("Found vue-query.config.ts file")
            if (!file.exports.pluginHook) file.exports.pluginHook = file.exports.default
            delete file.exports.default
            const { code } = generateCode(file) // We extract it with magicast...
            const shaked = await transform(code, { treeShaking: true, loader: "ts" }) // ...we clean it with esbuild.
            return shaked.code
          }
          else {
            logger.error("Found vue-query.config.ts file, but it does not export a `pluginHook`.")
          }
        }
        else {
          logger.info("No vue-query.config.ts file found.")
        }
        return "export function pluginHook() { return { pluginReturn: null, vueQueryPluginOptions: null}}"
      }
    })

    // 4. Augment NuxtApp with the pluginHook return type (for provide)
    addTypeTemplate({
      filename: "types/vue-query-nuxt-advanced.d.ts",
      write: true,
      getContents: () => `
      type PluginHookResult = Awaited<ReturnType<typeof import(".nuxt/${filename}").pluginHook>["pluginReturn"]>

      type AddDollarPrefix<T> = {
        [K in keyof T['provide'] as \`$\${string & K}\`]: T['provide'][K]
      }

      declare module '#app' {
        interface NuxtApp extends AddDollarPrefix<PluginHookResult> {}
      }
      export { }`
    })

    // 5. Auto - reload the config
    nuxt.hook("builder:watch", async (event, path) => {
      path = relative(nuxt.options.srcDir, resolve(nuxt.options.srcDir, path))
      if (path.includes("vue-query.config.ts")) {
        logger.info(`[vue-query] config changed '@${event}'`, path)
        updateTemplates({ filter: t => t.filename === filename })
        logger.success("[vue-query] config reloaded.")
      }
    })

    // 6. Auto Imports tanstack composables
    if (userOptions.autoImports && userOptions.autoImports.length > 0)
      addImports(userOptions.autoImports.map(name => ({ name, from: "@tanstack/vue-query" })))

    logger.success(`Added ${NAME} module successfully.`)
  }
})
