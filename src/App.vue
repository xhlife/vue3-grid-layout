<script setup lang="ts">
import {ref, reactive, watch} from "vue"
import {testData} from "./test"

import GridLayout from "./components/Grid/GridLayout.vue"
import GridItem from "./components/Grid/GridItem.vue"

let testLayout = ref(testData)

function handleResize(i: string | number, w: number, h: number, x: number, y: number) {
  console.log(i, w, h, x, y)
}
const responsive = ref<boolean>(false)
</script>

<template>
  <div class="layout">
    <GridLayout v-model:layout="testLayout" :responsive="responsive" :col-num="12" :row-height="30">
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
        @resized="handleResize"
      >
        <!--<custom-drag-element :text="item.i"></custom-drag-element>-->
        <div>
          {{ item.i }}
          <!-- {{ style }} -->
        </div>
        <!--<button @click="clicked">CLICK ME!</button>-->
      </grid-item>
    </GridLayout>
  </div>
</template>

<style scoped>
.layout {
  background-color: #eee;
}
.test {
  background-color: #ddd;
}
</style>
