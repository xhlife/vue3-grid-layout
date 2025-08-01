<script setup lang="ts">
import {ref, reactive, watch, onMounted, nextTick} from "vue"
import {testData} from "./test"

import GridLayout from "./components/Grid/GridLayout.vue"
import GridItem from "./components/Grid/GridItem.vue"
import ExampleOne from "./example/exampleOne.vue"
import CustomGridItem from "./CustomGridItem.vue"
let testLayout = ref(testData)

const refLayout = ref()

const colNum = ref<number>(12)

const mapCache: Map<string, any> = new Map()

function handleResize(i: string | number, w: number, h: number, x: number, y: number) {
  console.log(i, w, h, x, y)
}
const responsive = ref<boolean>(false)

function set$Children(vm: any) {
  if (vm && vm.i) {
    // console.log(vm.autoSize())
    mapCache.set(vm.i, vm)
  }
}
// {x: number | null; y: number | null}

let mouseXY = {x: 0, y: 0}
let DragPos = {x: 0, y: 0, w: 1, h: 1, i: ""}

function drag(e: DragEvent) {
  e.stopPropagation()
  e.preventDefault()
  const t = document.getElementById("content") as HTMLElement
  let parentRect = t.getBoundingClientRect()
  let mouseInGrid = false
  if (
    mouseXY.x > parentRect.left &&
    mouseXY.x < parentRect.right &&
    mouseXY.y > parentRect.top &&
    mouseXY.y < parentRect.bottom
  ) {
    mouseInGrid = true
  }
  if (mouseInGrid === true && testLayout.value.findIndex(item => item.i === "drop") === -1) {
    testLayout.value.push({
      x: (testLayout.value.length * 2) % colNum.value,
      y: testLayout.value.length + colNum.value, // puts it at the bottom
      w: 3,
      h: 4,
      i: "drop"
    })
  }

  let index = testLayout.value.findIndex(item => item.i === "drop")

  if (index !== -1) {
    try {
      refLayout.value.defaultGridItem.$el.style.display = "none"
    } catch {}
    let el = mapCache.get("drop")
    if (!el) return
    // console.log("jjj")

    el.dragging = {top: mouseXY.y - parentRect.top, left: mouseXY.x - parentRect.left}
    let new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left)
    if (mouseInGrid === true) {
      refLayout.value.dragEvent("dragstart", "drop", new_pos.x, new_pos.y, 3, 4)
      DragPos.i = String(index)
      DragPos.x = testLayout.value[index].x
      DragPos.y = testLayout.value[index].y
    }
    if (mouseInGrid === false) {
      refLayout.value.dragEvent("dragend", "drop", new_pos.x, new_pos.y, 3, 4)
      testLayout.value = testLayout.value.filter(obj => obj.i !== "drop")
    }
  }
}

function dragend() {
  const t = document.getElementById("content") as HTMLElement
  let parentRect = t.getBoundingClientRect()
  let mouseInGrid = false
  if (
    mouseXY.x > parentRect.left &&
    mouseXY.x < parentRect.right &&
    mouseXY.y > parentRect.top &&
    mouseXY.y < parentRect.bottom
  ) {
    mouseInGrid = true
  }

  if (mouseInGrid === true) {
    refLayout.value.dragEvent("dragend", "drop", DragPos.x, DragPos.y, 3, 4)
    testLayout.value = testLayout.value.filter(obj => obj.i !== "drop")
    // UNCOMMENT below if you want to add a grid-item
    nextTick(() => {
      testLayout.value.push({
        x: DragPos.x,
        y: DragPos.y,
        w: 3,
        h: 4,
        i: DragPos.i
      })
      refLayout.value.dragEvent("dragend", DragPos.i, DragPos.x, DragPos.y, 3, 4)
      mapCache.delete("drop")
    })
  }
}

function addDragOverEvent(e: DragEvent) {
  mouseXY.x = e.clientX
  mouseXY.y = e.clientY
}
onMounted(() => {
  document.addEventListener("dragover", addDragOverEvent)
})

const handleMousedown = (index: number) => {
  testLayout.value.splice(index, 1)
}
</script>

<template>
  <div class="layout">
    <div
      class="droppable-element"
      draggable="true"
      unselectable="on"
      @drag="drag"
      @dragend="dragend"
    >
      Droppable Element (Drag me!)
    </div>
    <div id="content">
      <GridLayout
        ref="refLayout"
        v-model:layout="testLayout"
        :responsive="responsive"
        :col-num="15"
        :row-height="30"
        :vertical-compact="false"
        :use-css-transforms="false"
        :margin="[10, 10]"
        class="grid"
        :is-mirrored="false"
        :restore-on-drag="true"
      >
      <CustomGridItem v-for="item in testLayout" :item="item"></CustomGridItem>
      </GridLayout>
    </div>
  </div>
  <!-- <ExampleOne></ExampleOne> -->
</template>

<style scoped>
.layout {
  background-color: #eee;
}
.test {
  background-color: #ddd;
}
.droppable-element {
  width: 150px;
  text-align: center;
  background: #fdd;
  border: 1px solid black;
  margin: 10px 0;
  padding: 10px;
}
.grid::before {
    content: '';
    background-size: calc(calc(100% - 5px) / 12) 40px;
    background-image: linear-gradient(
            to right,
            lightgrey 1px,
            transparent 1px
    ),
    linear-gradient(to bottom, lightgrey 1px, transparent 1px);
    height: calc(100% - 5px);
    width: calc(100% - 5px);
    position: absolute;
    background-repeat: repeat;
    margin:5px;
}
</style>
