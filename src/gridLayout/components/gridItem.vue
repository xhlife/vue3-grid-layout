<template>
  <div ref="gridItem" class="vue-grid-item" :class="classObj" :style="state.style">
    <slot></slot>
    <span
      v-if="resizableAndNotStatic"
      ref="handle"
      :class="resizableHandleClass"
    ></span>
    <!--<span v-if="draggable" ref="dragHandle" class="vue-draggable-handle"></span>-->
  </div>
</template>

<script lang="ts" setup>
import {
  setTopLeft,
  setTopRight,
  setTransformRtl,
  setTransform,
} from '../helpers/utils';
import { getControlPosition, createCoreData } from '../helpers/draggableUtils';
import { getColsFromBreakpoint } from '../helpers/responsiveUtils';
import { getDocumentDir } from '../helpers/DOM';
import interact from 'interactjs';

import {
  reactive,
  ref,
  inject,
  computed,
  watch,
  onBeforeUnmount,
  onMounted,
  useSlots,
  getCurrentInstance
} from 'vue';
interface Out {
  right?: number;
  left?: number;
  top: number;
  width: number;
  height: number;
}
const eventBus = inject('eventBus');
// const layout = inject('layout');
const $parent = getCurrentInstance()?.parent;
const layout = {
  ...$parent.ctx,
  ...$parent.exposed
}

const $emit = defineEmits([
  'container-resized',
  'resize',
  'resizeend',
  'resized',
  'resizeEvent',
  'move',
  'moved',
]);
const props = defineProps({
  isDraggable: {
    type: Boolean,
    required: false,
    default: null,
  },
  isResizable: {
    type: Boolean,
    required: false,
    default: null,
  },
  static: {
    type: Boolean,
    required: false,
    default: false,
  },
  minH: {
    type: Number,
    required: false,
    default: 1,
  },
  minW: {
    type: Number,
    required: false,
    default: 1,
  },
  maxH: {
    type: Number,
    required: false,
    default: Infinity,
  },
  maxW: {
    type: Number,
    required: false,
    default: Infinity,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  w: {
    type: Number,
    required: true,
  },
  h: {
    type: Number,
    required: true,
  },
  i: {
    required: true,
  },
  dragIgnoreFrom: {
    type: String,
    required: false,
    default: 'a, button',
  },
  dragAllowFrom: {
    type: String,
    required: false,
    default: null,
  },
  resizeIgnoreFrom: {
    type: String,
    required: false,
    default: 'a, button',
  },
  preserveAspectRatio: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const $slot = useSlots();
const gridItem = ref(null);
const state = reactive({
  cols: 1,
  containerWidth: 100,
  rowHeight: 30,
  margin: [10, 10],
  maxRows: Infinity,
  draggable: null,
  resizable: null,
  useCssTransforms: true,
  useStyleCursor: true,

  isDragging: false,
  dragging: null,
  isResizing: false,
  resizing: null,
  lastX: NaN,
  lastY: NaN,
  lastW: NaN,
  lastH: NaN,
  style: {},
  rtl: false,

  dragEventSet: false,
  resizeEventSet: false,

  previousW: null,
  previousH: null,
  previousX: null,
  previousY: null,
  innerX: props.x,
  innerY: props.y,
  innerW: props.w,
  innerH: props.h,
  interactObj: null,
});
const isDraggable = computed(() => props.isDraggable);
const isResizable = computed(() => props.isResizable);
const resizableAndNotStatic = computed(() => state.resizable && !props.static);

const draggableOrResizableAndNotStatic = computed(() => {
  return (state.draggable || state.resizable) && !props.static;
});
const isAndroid = computed(() => {
  return navigator.userAgent.toLowerCase().indexOf('andriod') !== -1;
});
const renderRtl = computed(() => (layout.isMirrored ? !state.rtl : state.rtl));
const resizableHandleClass = computed(() => {
  if (renderRtl.value) {
    return 'vue-resizable-handle vue-rtl-resizable-handle';
  } else {
    return 'vue-resizable-handle';
  }
});
const classObj = computed(() => {
  return {
    'vue-resizable': resizableAndNotStatic.value,
    static: props.static,
    resizing: state.isResizing,
    'vue-draggable-dragging': state.isDragging,
    cssTransforms: state.useCssTransforms,
    'render-rtl': renderRtl.value,
    'disable-userselect': state.isDragging,
    'no-touch': isAndroid.value && draggableOrResizableAndNotStatic.value,
  };
});
function updateWidthHandler(width: number): void {
  updateWidth(width);
}
function compactHandler<T>(layout: T): void {
  compact(layout);
}
function setDraggableHandler(isDrag: boolean): void {
  if (isDraggable.value === null || isDraggable.value === undefined) {
    state.draggable= isDrag;
  }
}

function setResizableHandler(isResize: boolean): void {
  if (isResizable.value === null || isResizable.value === undefined) {
    state.resizable = isResize;
  }
}
function setRowHeightHandler(rowHeight: number): void {
  state.rowHeight = rowHeight;
}
function setMaxRowsHandler(maxRows: number): void {
  state.maxRows = maxRows;
}
function directionchangeHandler(): void {
  state.rtl = getDocumentDir() === 'rtl';
  compact();
}
function setColNum(colNum: number): void {
  state.cols = parseInt(colNum);
}
eventBus.on('updateWidth', updateWidthHandler);
eventBus.on('compact', compactHandler);
eventBus.on('setDraggable', setDraggableHandler);
eventBus.on('setResizable', setResizableHandler);
eventBus.on('setRowHeight', setRowHeightHandler);
eventBus.on('setMaxRows', setMaxRowsHandler);
eventBus.on('directionchange', directionchangeHandler);
eventBus.on('setColNum', setColNum);

state.rtl = getDocumentDir() === 'rtl';

onBeforeUnmount(() => {
  eventBus.off('updateWidth', updateWidthHandler);
  eventBus.off('compact', compactHandler);
  eventBus.off('setDraggable', setDraggableHandler);
  eventBus.off('setResizable', setResizableHandler);
  eventBus.off('setRowHeight', setRowHeightHandler);
  eventBus.off('setMaxRows', setMaxRowsHandler);
  eventBus.off('directionchange', directionchangeHandler);
  eventBus.off('setColNum', setColNum);
  if (state.interactObj) {
    state.interactObj.unset(); // destroy interact intance
  }
});
onMounted(() => {
  if (layout.responsive && layout.lastBreakpoint) {
    state.cols = getColsFromBreakpoint(layout.lastBreakpoint, layout.cols);
  } else {
    state.cols = layout.colNum;
  }
  state.rowHeight = layout.rowHeight;
  // debugger;
  state.containerWidth = (layout.width !== null && layout.width !== undefined) ? layout.width : 100;
  state.margin = layout.margin !== undefined ? layout.margin : [10, 10];
  state.maxRows = layout.maxRows;
  if (isDraggable.value === null || isDraggable.value === undefined) {
    state.draggable = layout.isDraggable;
  } else {
    state.draggable = isDraggable.value;
  }
  if (isResizable.value !== null || isResizable.value !== undefined) {
    state.resizable = layout.isResizable;
  } else {
    state.resizable = isResizable.value;
  }
  state.useCssTransforms = layout.useCssTransforms;
  state.useStyleCursor = layout.useStyleCursor;
  createStyle();
});
watch(
  () => isDraggable,
  (val) => (state.draggable = val)
);
watch(
  () => props.static,
  () => {
    tryMakeDraggable();
    tryMakeResizable();
  }
);
watch(
  () => state.draggable,
  () => {
    tryMakeDraggable();
  }
);
watch(
  () => isResizable,
  (val) => {
    state.resizable = val;
  }
);
watch(() => state.resizable, () => {
  tryMakeResizable();
});
watch(
  () => state.rowHeight,
  () => {
    createStyle();
    emitContainerResized();
  }
);
watch(
  () => state.cols,
  () => {
    tryMakeResizable();
    createStyle();
    emitContainerResized();
  }
);
watch(
  () => state.containerWidth,
  () => {
    tryMakeResizable();
    createStyle();
    emitContainerResized();
  }
);

watch(
  () => props.x,
  (x: number) => {
    state.innerX = x;
    createStyle();
  }
);
watch(
  () => props.y,
  (y: number) => {
    state.innerY = y;
    createStyle();
  }
);
watch(
  () => props.h,
  (h: number) => {
    state.innerH = h;
    createStyle();
  }
);
watch(
  () => props.w,
  (w: number) => {
    state.innerW = w;
    createStyle();
  }
);
watch(renderRtl, () => {
  tryMakeResizable();
  createStyle();
});
watch(
  () => props.minH,
  () => tryMakeResizable()
);
watch(
  () => props.maxH,
  () => tryMakeResizable()
);
watch(
  () => props.minW,
  () => tryMakeResizable()
);
watch(
  () => props.maxW,
  () => tryMakeResizable()
);
watch(
  () => layout.margin,
  (margin) => {
    if (
      !margin ||
      (margin[0] === state.margin[0] && margin[1] === state.margin[1])
    ) {
      return;
    }
    state.margin = margin.map((m) => Number(m));
    createStyle();
    emitContainerResized();
  }
);

function createStyle(): void {
  if (props.x + props.w > state.cols) {
    state.innerX = 0;
    state.innerW = props.w > state.cols ? state.cols : props.w;
  } else {
    state.innerX = props.x;
    state.innerW = props.w;
  }
  let { innerX, innerY, innerW, innerH } = state;
  let pos = calcPosition(innerX, innerY, innerW, innerH);
  if (state.isDragging) {
    pos.top = state.dragging.top;
    if (renderRtl.value) {
      pos.right = state.dragging.left;
    } else {
      pos.left = state.dragging.left;
    }
  }
  if (state.isResizing) {
    pos.width = state.resizing.width;
    pos.height = state.resizing.height;
  }
  let style;
  if (state.useCssTransforms) {
    if (renderRtl.value) {
      style = setTransformRtl(pos.top, pos.right, pos.width, pos.height);
    } else {
      style = setTransform(pos.top, pos.left, pos.width, pos.height);
    }
  } else {
    if (renderRtl.value) {
      style = setTopRight(pos.top, pos.right, pos.width, pos.height);
    } else {
      style = setTopLeft(pos.top, pos.left, pos.width, pos.height);
    }
  }
  state.style = style;
}

function emitContainerResized(): void {
  let styleProps = {};
  for (let prop of ['wdith', 'height']) {
    let val = state.style[prop];
    let matches = val?.match(/^(\d+)px$/);
    if (!matches) return;
    styleProps[prop] = matches[1];
  }
  $emit(
    'container-resized',
    props.i,
    props.h,
    props.w,
    styleProps.height,
    styleProps.width
  );
}
function handleResize<T>(event: T): void {  
  if (props.static) return;
  const position = getControlPosition(event);
  if (position === null || position === undefined) return;

  const { x, y } = position;

  const newSize = { width: 0, height: 0 };
  let pos;
  switch (event.type) {
    case 'resizestart': {
      state.previousW = state.innerW;
      state.previousH = state.innerH;
      pos = calcPosition(
        state.innerX,
        state.innerY,
        state.innerW,
        state.innerH
      );
      newSize.width = pos.width;
      newSize.height = pos.height;
      state.resizing = newSize;
      state.isResizing = true;
      break;
    }
    case 'resizemove': {
      const coreEvent = createCoreData(state.lastW, state.lastH, x, y);
      if (renderRtl.value) {
        newSize.width = state.resizing.width - coreEvent.deltaX;
      } else {
        newSize.width = state.resizing.width + coreEvent.deltaX;
      }
      newSize.height = state.resizing.height + coreEvent.deltaY;

      /// console.log("### resize => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
      state.resizing = newSize;
      break;
    }
    case 'resizeend': {
      pos = calcPosition(
        state.innerX,
        state.innerY,
        state.innerW,
        state.innerH
      );
      newSize.width = pos.width;
      newSize.height = pos.height;
      //                        console.log("### resize end => " + JSON.stringify(newSize));
      state.resizing = null;
      state.isResizing = false;
      break;
    }
  }
  // Get new WH
  pos = calcWH(newSize.height, newSize.width);
  if (pos.w < props.minW) {
    pos.w = props.minW;
  }
  if (pos.w > state.maxW) {
    pos.w = state.maxW;
  }
  if (pos.h < state.minH) {
    pos.h = state.minH;
  }
  if (pos.h > state.maxH) {
    pos.h = state.maxH;
  }

  if (pos.h < 1) {
    pos.h = 1;
  }
  if (pos.w < 1) {
    pos.w = 1;
  }

  state.lastW = x;
  state.lastH = y;

  if (state.innerW !== pos.w || state.innerH !== pos.h) {
    $emit('resize', props.i, pos.h, pos.w, newSize.height, newSize.width);
  }
  if (
    event.type === 'resizeend' &&
    (state.previousW !== state.innerW || state.previousH !== state.innerH)
  ) {
    $emit('resized', props.i, pos.h, pos.w, newSize.height, newSize.width);
  }
  eventBus.emit('resizeEvent', {
    eventType: event.type,
    i: props.i,
    x: state.innerX,
    y: state.innerY,
    h: pos.h,
    w: pos.w,
  });
}

function handleDrag<T>(event: T): void {
  if (props.static) return;
  if (state.isResizing) return;

  const position = getControlPosition(event);

  if (position === null) return;
  const { x, y } = position;
  let newPosition = { top: 0, left: 0 };
  switch (event.type) {
    case 'dragstart': {
      state.previousX = state.innerX;
      state.previousY = state.innerY;

      let parentRect = event.target.offsetParent.getBoundingClientRect();
      let clientRect = event.target.getBoundingClientRect();
      if (renderRtl.value) {
        newPosition.left = (clientRect.right - parentRect.right) * -1;
      } else {
        newPosition.left = clientRect.left - parentRect.left;
      }
      newPosition.top = clientRect.top - parentRect.top;
      state.dragging = newPosition;
      state.isDragging = true;
      break;
    }
    case 'dragend': {
      if (!state.isDragging) return;
      let parentRect = event.target.offsetParent.getBoundingClientRect();
      let clientRect = event.target.getBoundingClientRect();
      //                        Add rtl support
      if (renderRtl.value) {
        newPosition.left = (clientRect.right - parentRect.right) * -1;
      } else {
        newPosition.left = clientRect.left - parentRect.left;
      }
      newPosition.top = clientRect.top - parentRect.top;
      //                        console.log("### drag end => " + JSON.stringify(newPosition));
      //                        console.log("### DROP: " + JSON.stringify(newPosition));
      state.dragging = null;
      state.isDragging = false;
      // shouldUpdate = true;
      break;
    }
    case 'dragmove': {
      const coreEvent = createCoreData(state.lastX, state.lastY, x, y);
      //                        Add rtl support
      if (renderRtl.value) {
        newPosition.left = state.dragging.left - coreEvent.deltaX;
      } else {
        newPosition.left = state.dragging.left + coreEvent.deltaX;
      }
      newPosition.top = state.dragging.top + coreEvent.deltaY;
      //                        console.log("### drag => " + event.type + ", x=" + x + ", y=" + y);
      //                        console.log("### drag => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
      //                        console.log("### drag end => " + JSON.stringify(newPosition));
      state.dragging = newPosition;
      break;
    }
  }
  // Get new XY
  let pos;
  if (renderRtl.value) {
    pos = calcXY(newPosition.top, newPosition.left);
  } else {
    pos = calcXY(newPosition.top, newPosition.left);
  }

  state.lastX = x;
  state.lastY = y;

  if (state.innerX !== pos.x || state.innerY !== pos.y) {
    $emit('move', props.i, pos.x, pos.y);
  }
  if (
    event.type === 'dragend' &&
    (state.previousX !== state.innerX || state.previousY !== state.innerY)
  ) {
    $emit('moved', props.i, pos.x, pos.y);
  }
  eventBus.emit('dragEvent', {
    eventType: event.type,
    i: props.i,
    x: pos.x,
    y: pos.y,
    h: state.innerH,
    w: state.innerW,
  });
}
function calcPosition(x: number, y: number, w: number, h: number): Out {
  const colWidth = calcColWidth();
  // add rtl support
  let out: Out = {};
  if (renderRtl.value) {
    out = {
      right: Math.round(colWidth * x + (x + 1) * state.margin[0]),
      top: Math.round(state.rowHeight * y + (y + 1) * state.margin[1]),
      // 0 * Infinity === NaN, which causes problems with resize constriants;
      // Fix thi s if it occurs.
      // Note we do it here rather than later because Math.round(Infinity) causes deopt
      width:
        w === Infinity
          ? w
          : Math.round(colWidth * w + Math.max(0, w - 1) * state.margin[0]),
      height:
        h === Infinity
          ? h
          : Math.round(
              state.rowHeight * h + Math.max(0, h - 1) * state.margin[1]
            ),
    };
  } else {
    out = {
      left: Math.round(colWidth * x + (x + 1) * state.margin[0]),
      top: Math.round(state.rowHeight * y + (y + 1) * state.margin[1]),
      // 0 * Infinity === NaN, which causes problems with resize constriants;
      // Fix thi s if it occurs.
      // Note we do it here rather than later because Math.round(Infinity) causes deopt
      width:
        w === Infinity
          ? w
          : Math.round(colWidth * w + Math.max(0, w - 1) * state.margin[0]),
      height:
        h === Infinity
          ? h
          : Math.round(
              state.rowHeight * h + Math.max(0, h - 1) * state.margin[1]
            ),
    };
  }
  return out;
}
/**
 * Translate x and y coordinates from pixels to grid units.
 * @param  {Number} top  Top position (relative to parent) in pixels.
 * @param  {Number} left Left position (relative to parent) in pixels.
 * @return {Object} x and y in grid units.
 */
// TODO check if this function needs change in order to support rtl.
function calcXY(top: number, left: number): { x: number; y: number } {
  const colWidth = calcColWidth();

  // left = colWidth * x + margin * (x + 1)
  // l = cx + m(x+1)
  // l = cx + mx + m
  // l - m = cx + mx
  // l - m = x(c + m)
  // (l - m) / (c + m) = x
  // x = (left - margin) / (coldWidth + margin)
  let x = Math.round((left - state.margin[0]) / (colWidth + state.margin[0]));
  let y = Math.round(
    (top - state.margin[1]) / (state.rowHeight + state.margin[1])
  );

  // Capping
  x = Math.max(Math.min(x, state.cols - state.innerW), 0);
  y = Math.max(Math.min(y, state.maxRows - state.innerH), 0);

  return { x, y };
}
// Helper for generating column width
function calcColWidth(): number {
  const colWidth =
    (state.containerWidth - state.margin[0] * (state.cols + 1)) / state.cols;
  // console.log("### COLS=" + this.cols + " COL WIDTH=" + colWidth + " MARGIN " + this.margin[0]);
  return colWidth;
}
/**
 * Given a height and width in pixel values, calculate grid units.
 * @param  {Number} height Height in pixels.
 * @param  {Number} width  Width in pixels.
 * @return {Object} w, h as grid units.
 */
function calcWH(height, width): { w: number; h: number } {
  const colWidth = calcColWidth();

  // width = colWidth * w - (margin * (w - 1))
  // ...
  // w = (width + margin) / (colWidth + margin)
  let w = Math.round((width + state.margin[0]) / (colWidth + state.margin[0]));
  let h = Math.round(
    (height + state.margin[1]) / (state.rowHeight + state.margin[1])
  );

  // Capping
  w = Math.max(Math.min(w, state.cols - state.innerX), 0);
  h = Math.max(Math.min(h, state.maxRows - state.innerY), 0);
  return { w, h };
}
function updateWidth(width:number, colNum: number): void {
  state.containerWidth = width;
  if (colNum !== undefined && colNum !== null) {
    state.cols = colNum;
  }
}
function compact() {
  createStyle();
}
function tryMakeDraggable() {
  if (state.interactObj === null || state.interactObj === undefined) {
    state.interactObj = interact(gridItem.value);
    if (!state.useStyleCursor) {
      state.interactObj.styleCursor(false);
    }
  }
  if (state.draggable && !props.static) {
    const opts = {
      ignoreFrom: props.dragIgnoreFrom,
      allowFrom: props.dragAllowFrom,
    };
    state.interactObj.draggable(opts);
    /* this.interactObj.draggable({allowFrom: '.vue-draggable-handle'}); */
    if (!state.dragEventSet) {
      state.dragEventSet = true;
      state.interactObj.on('dragstart dragmove dragend', (event) => {
        handleDrag(event);
      });
    }
  } else {
    state.interactObj.draggable({
      enabled: false,
    });
  }
}
function tryMakeResizable() {
  if (state.interactObj === null || state.interactObj === undefined) {
    state.interactObj = interact(gridItem.value);
    if (!state.useStyleCursor) {
      state.interactObj.styleCursor(false);
    }
  }
  if (state.resizable && !props.static) {
    let maximum = calcPosition(0, 0, props.maxW, props.maxH);
    let minimum = calcPosition(0, 0, props.minW, props.minH);

    // console.log("### MAX " + JSON.stringify(maximum));
    // console.log("### MIN " + JSON.stringify(minimum));

    const opts = {
      // allowFrom: "." + this.resizableHandleClass.trim().replace(" ", "."),
      edges: {
        left: false,
        right: '.' + resizableHandleClass.value.trim().replace(' ', '.'),
        bottom: '.' + resizableHandleClass.value.trim().replace(' ', '.'),
        top: false,
      },
      ignoreFrom: props.resizeIgnoreFrom,
      restrictSize: {
        min: {
          height: minimum.height,
          width: minimum.width,
        },
        max: {
          height: maximum.height,
          width: maximum.width,
        },
      },
    };

    if (props.preserveAspectRatio) {
      opts.modifiers = [
        interact.modifiers.aspectRatio({
          ratio: 'preserve',
        }),
      ];
    }

    state.interactObj.resizable(opts);
    if (!state.resizeEventSet) {
      state.resizeEventSet = true;
      state.interactObj.on('resizestart resizemove resizeend', (event) => {
        handleResize(event);
      });
    }
  } else {
    state.interactObj.resizable({
      enabled: false,
    });
  }
}
function autoSize() {
  // ok here we want to calculate if a resize is needed
  state.previousW = state.innerW;
  state.previousH = state.innerH;

  let newSize = $slots.default()[0].elm.getBoundingClientRect();
  let pos = calcWH(newSize.height, newSize.width);
  if (pos.w < props.minW) {
    pos.w = props.minW;
  }
  if (pos.w > props.maxW) {
    pos.w = props.maxW;
  }
  if (pos.h < props.minH) {
    pos.h = props.minH;
  }
  if (pos.h > props.maxH) {
    pos.h = props.maxH;
  }

  if (pos.h < 1) {
    pos.h = 1;
  }
  if (pos.w < 1) {
    pos.w = 1;
  }

  // this.lastW = x; // basically, this is copied from resizehandler, but shouldn't be needed
  // this.lastH = y;

  if (state.innerW !== pos.w || state.innerH !== pos.h) {
    $emit('resize', props.i, pos.h, pos.w, newSize.height, newSize.width);
  }
  if (state.previousW !== pos.w || state.previousH !== pos.h) {
    $emit('resized', props.i, pos.h, pos.w, newSize.height, newSize.width);
    eventBus.emit('resizeEvent', {
      eventType: 'resizeend',
      i: props.i,
      x: state.innerX,
      y: state.innerY,
      h: pos.h,
      w: pos.w,
    });
  }
}
</script>

<style>
.vue-grid-item {
  transition: all 200ms ease;
  transition-property: left, top, right;
  /* add right for rtl */
}

.vue-grid-item.no-touch {
  -ms-touch-action: none;
  touch-action: none;
}

.vue-grid-item.cssTransforms {
  transition-property: transform;
  left: 0;
  right: auto;
}

.vue-grid-item.cssTransforms.render-rtl {
  left: auto;
  right: 0;
}

.vue-grid-item.resizing {
  opacity: 0.6;
  z-index: 3;
}

.vue-grid-item.vue-draggable-dragging {
  transition: none;
  z-index: 3;
}

.vue-grid-item.vue-grid-placeholder {
  background: red;
  opacity: 0.2;
  transition-duration: 100ms;
  z-index: 2;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.vue-grid-item > .vue-resizable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
}

.vue-grid-item > .vue-rtl-resizable-handle {
  bottom: 0;
  left: 0;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAuMDAwMDAwMDAwMDAwMDAyIiBoZWlnaHQ9IjEwLjAwMDAwMDAwMDAwMDAwMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9Im5vbmUiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB5PSItMSIgeD0iLTEiLz4KICA8ZyBkaXNwbGF5PSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgeT0iMCIgeD0iMCIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgaWQ9ImNhbnZhc0dyaWQiPgogICA8cmVjdCBmaWxsPSJ1cmwoI2dyaWRwYXR0ZXJuKSIgc3Ryb2tlLXdpZHRoPSIwIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIi8+CiAgPC9nPgogPC9nPgogPGc+CiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPgogIDxsaW5lIGNhbnZhcz0iI2ZmZmZmZiIgY2FudmFzLW9wYWNpdHk9IjEiIHN0cm9rZS1saW5lY2FwPSJ1bmRlZmluZWQiIHN0cm9rZS1saW5lam9pbj0idW5kZWZpbmVkIiBpZD0ic3ZnXzEiIHkyPSItNzAuMTc4NDA3IiB4Mj0iMTI0LjQ2NDE3NSIgeTE9Ii0zOC4zOTI3MzciIHgxPSIxNDQuODIxMjg5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSJub25lIi8+CiAgPGxpbmUgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z181IiB5Mj0iOS4xMDY5NTciIHgyPSIwLjk0NzI0NyIgeTE9Ii0wLjAxODEyOCIgeDE9IjAuOTQ3MjQ3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KICA8bGluZSBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z183IiB5Mj0iOSIgeDI9IjEwLjA3MzUyOSIgeTE9IjkiIHgxPSItMC42NTU2NCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2U9IiM2NjY2NjYiIGZpbGw9Im5vbmUiLz4KIDwvZz4KPC9zdmc+);
  background-position: bottom left;
  padding-left: 3px;
  background-repeat: no-repeat;
  background-origin: content-box;
  cursor: sw-resize;
  right: auto;
}

.vue-grid-item.disable-userselect {
  user-select: none;
}
</style>
