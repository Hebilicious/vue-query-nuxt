<script setup lang="ts">
const { data, isLoading } = useQuery({
  queryKey: ["todos"],
  queryFn: () => $fetch("/api/todos")
})
const { $wagmi } = useNuxtApp()
const config = useConfig()
</script>

<template>
  <div>
    <h1>Todos</h1>
    <p v-if="isLoading">
      Loading
    </p>
    <pre>{{ data }}</pre>
  </div>
</template>
