<template>
  <grid-item
    :key="item.i"
    class="test"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :i="item.i"
    @resized="handleResize"
  >
    <!--<custom-drag-element :text="item.i"></custom-drag-element>-->
    <div>
      {{ item.i }}
      <!-- {{ style }} -->
    </div>
  </grid-item>
</template>
<script lang="ts" setup>
import {ref, reactive, toRefs, onMounted} from "vue"

import {GridItem} from "./components"

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

onMounted(() => {
  console.log("mounted")
})
function handleResize(i: string | number, w: number, h: number, x: number, y: number) {
  console.log(i, w, h, x, y)
}
</script>
<style scoped>

</style>
