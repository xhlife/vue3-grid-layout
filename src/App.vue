<script setup lang="ts">
import {reactive} from "vue"
import {testData} from "./test"

import GridLayout from "./components/Grid/GridLayout.vue"
import GridItem from "./components/Grid/GridItem.vue"

let testLayout = reactive(testData)

function handleResize(i: string | number, w: number, h: number, x: number, y: number) {
  console.log(i, w, h, x, y)
}
</script>

<template>
  <div>
    <GridLayout v-model:layout="testLayout">
      <grid-item
        v-for="item in testLayout"
        :key="item.i"
        class="test"
        :static="item.static"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-w="item.minW"
        :max-w="item.maxW"
        :min-x="item.minX"
        :max-x="item.maxX"
        :min-y="item.minY"
        :max-y="item.maxY"
        :is-draggable="item.draggable"
        :is-resizable="item.resizable"
        :preserve-aspect-ratio="item.preserveAspectRatio"
        @resized="handleResize"
      >
        <!--<custom-drag-element :text="item.i"></custom-drag-element>-->
        <div>
          <!-- {{ style }} -->
        </div>
        <!--<button @click="clicked">CLICK ME!</button>-->
      </grid-item>
    </GridLayout>
  </div>
</template>

<style scoped>
.test {
  background-color: #ddd;
}
</style>
