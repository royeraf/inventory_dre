<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();

// Al montar la app, verificar si hay sesión activa
onMounted(async () => {
  if (authStore.token) {
    await authStore.initialize();
  }
});
</script>