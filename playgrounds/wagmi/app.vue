<script setup lang="ts">
const { data, isLoading } = useQuery({
  queryKey: ["todos"],
  queryFn: () => $fetch("/api/todos")
})
const { $wagmi } = useNuxtApp()
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
