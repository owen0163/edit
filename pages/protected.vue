<script setup>
import { useNuxtApp } from '#app';

const { $auth } = useNuxtApp();
const isAuthenticated = $auth.isAuthenticated();

if (!isAuthenticated) {
  navigateTo('/'); // Redirect to login page if not authenticated
}
</script>