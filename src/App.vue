<template>
<div id="app">
  <div class="router">
    <router-link to="home">home</router-link>
    <!-- <router-link to="about">about</router-link> -->
  </div>
  <router-view></router-view>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
})
</script>