<script setup lang="ts">
const { $createHooks, $test } = useNuxtApp()
$test.log("hello")
</script>

<template>
  HELLO WORLD
  <pre>
    {{ typeof $createHooks }}
  </pre>
</template>
