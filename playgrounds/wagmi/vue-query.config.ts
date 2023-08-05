import { createPublicClient, http } from "viem"
import { createConfig, mainnet } from "use-wagmi"

export default defineVueQueryPluginHook(({ nuxt }) => {
  const wagmiConfig = createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
      chain: mainnet,
      transport: http()
    })
  })

  const _config = shallowRef(markRaw(wagmiConfig))
  const unsubscribe = wagmiConfig.subscribe(() => {
    triggerRef(markRaw(_config))
  })
  const originalUnmount = nuxt.vueApp.unmount
  nuxt.vueApp.unmount = function vueQueryUnmount() {
    unsubscribe()
    originalUnmount()
  }
  return {
    pluginReturn: { provide: { wagmi: wagmiConfig } },
    vueQueryPluginOptions: { queryClient: wagmiConfig.queryClient }
  }
})
