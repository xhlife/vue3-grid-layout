<template>
  <div class="vue-grid-layout" ref="girdDomItem" :style="mergedStyle">
    <slot></slot>
    <grid-item
      class="vue-grid-placeholder"
      v-show="isDragging"
      :x="placeholder.x"
      :y="placeholder.y"
      :w="placeholder.w"
      :h="placeholder.h"
      :i="placeholder.i"
    ></grid-item>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GridLayout'
}
</script>
<script lang="ts" setup>
import mitt, { Emitter } from 'mitt';
import elementResizeDetectorMaker from 'element-resize-detector';
import {
  bottom,
  compact,
  getLayoutItem,
  moveElement,
  validateLayout,
  cloneLayout,
  getAllCollisions,
  Layout,
} from '../helpers/utils';
import {
  getBreakpointFromWidth,
  getColsFromBreakpoint,
  findOrGenerateResponsiveLayout,
} from '../helpers/responsiveUtils';
import {
  addWindowEventListener,
  removeWindowEventListener,
} from '../helpers/DOM';
import GridItem from './gridItem.vue';
import {
  reactive,
  ref,
  computed,
  provide,
  getCurrentInstance,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  ComponentPublicInstance,
  nextTick,
  watch,
} from 'vue';
const props = defineProps({
  // If true, the container height swells and contracts to fit contents
  autoSize: {
    type: Boolean,
    default: true,
  },
  colNum: {
    // 列数
    type: Number,
    default: 12,
  },
  rowHeight: {
    // 行高
    type: Number,
    default: 150,
  },
  maxRows: {
    // 行数
    type: Number,
    default: Infinity,
  },
  margin: {
    // 边距
    type: Array,
    default: function () {
      return [10, 10];
    },
  },
  isDraggable: {
    // 是否可拖拽
    type: Boolean,
    default: true,
  },
  isResizable: {
    // 是否可拉伸
    type: Boolean,
    default: true,
  },
  isMirrored: {
    // 镜像
    type: Boolean,
    default: false,
  },
  useCssTransforms: {
    // 使用css transform
    type: Boolean,
    default: true,
  },
  verticalCompact: {
    // 垂直方向碰撞检测
    type: Boolean,
    default: true,
  },
  layout: {
    // item 的数组
    type: Array,
    required: true,
  },
  responsive: {
    // 响应式
    type: Boolean,
    default: false,
  },
  responsiveLayouts: {
    type: Object,
    default: function () {
      return {};
    },
  },
  breakpoints: {
    type: Object,
    default: function () {
      return { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
    },
  },
  cols: {
    type: Object,
    default: function () {
      return { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
    },
  },
  preventCollision: {
    type: Boolean,
    default: false,
  },
  useStyleCursor: {
    type: Boolean,
    default: true,
  },
});
const $emit = defineEmits([
  'layout-created',
  'layout-before-mount',
  'layout-mounted',
  'layout-updated',
  'updateWidth',
  'layout-ready',
  'onUpdate:layout'
]);
const eventBus: Emitter<Events> = mitt();
// const _this: ComponentPublicInstance = getCurrentInstance();

provide('eventBus', eventBus);
// provide('layout', _this);
const width = ref<number>(0);
const mergedStyle = ref<{ height: string }>({});
const lastLayoutLength = ref<number>(0);
const isDragging = ref<boolean>(false);
const placeholder = reactive({
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  i: -1,
});
let layouts = reactive<{ [propName]: Layout }>({});
const layout_ = computed({
  get:() => props.layout,
  set: (val) => val 
});
const lastBreakpoint = ref<number | string | null>(null);
let originalLayout = reactive(layout_.value);
const erd = ref<any>();
const girdDomItem = ref<HTMLDivElement>();
defineExpose({
  width,
  mergedStyle,
  lastLayoutLength,
  isDragging,
  placeholder,
  layouts,
  layout_,
  lastBreakpoint,
  originalLayout,
  erd,
  girdDomItem
})
// 缩放事件
function resizeEventHandler<T>(data: T) {
  if (!data) return;
  const { eventType, i, x, y, h, w } = data;
  resizeEvent(eventType, i, x, y, h, w);
}
// 拖拽事件
function dragEventHandler<T>(data: T) {
  if (!data) return;
  const { eventType, i, x, y, h, w } = data;
  dragEvent(eventType, i, x, y, h, w);
}
// 监听事件
eventBus.on('resizeEvent', resizeEventHandler);
eventBus.on('dragEvent', dragEventHandler);
$emit('layout-created', layout_);

onBeforeUnmount(() => {
  eventBus.off('resizeEvent', resizeEventHandler);
  eventBus.off('dragEvent', dragEventHandler);
  removeWindowEventListener('resize', onWindowResize);
  if (erd.value) {
    erd.uninstall(girdDomItem.value);
  }
});
onBeforeMount(() => {
  $emit('layout-before-mount', layout_.value);
});

onMounted(() => {
  $emit('layout-mounted', layout_.value);
  nextTick(() => {
    validateLayout(layout_.value);
    originalLayout = layout_.value;
    nextTick(() => {
      onWindowResize();
      initResponsiveFeatures();
      addWindowEventListener('resize', onWindowResize);

      compact(layout_.value, props.verticalCompact);
      $emit('layout-updated', layout_.value);
      updateHeight();
      nextTick(() => {
        erd.value = elementResizeDetectorMaker({
          strategy: 'scroll', // <- For ultra performance.
          // See https://github.com/wnr/element-resize-detector/issues/110 about callOnAdd.
          callOnAdd: false,
        });
        erd.value.listenTo(girdDomItem.value, () => {
          onWindowResize();
        });
      });
    });
  });
});

watch(() => width, (newVal, oldVal) => {
  nextTick(() => {
    $emit('updateWidth', width.value);
    if (oldVal === null) {
      nextTick(() => {
        $emit('layout-ready', layout_.value);
      });
    }
    updateHeight();
  });
});
watch(
  () => props.layout.length,
  () => layoutUpdate()
);
watch(
  () => props.colNum,
  (val) => eventBus.emit('setColNum', val)
);
watch(
  () => props.rowHeight,
  (val) => eventBus.emit('setRowHeight', val)
);
watch(
  () => props.isDraggable,
  (val) => eventBus.emit('setDraggable', val)
);
watch(
  () => props.isResizable,
  (val) => eventBus.emit('setResizeable', val)
);
watch(
  () => props.responsive,
  () => {
    if (!props.responsive) {
      $emit('onUpdate:layout', originalLayout);
      eventBus.emit('setColNum', props.colNum);
    }
    onWindowResize();
  }
);
watch(
  () => props.maxRows,
  (val) => eventBus.emit('setMaxRows', val)
);
watch(
  () => props.margin,
  () => updateHeight()
);

function layoutUpdate(): void {
  if (layout_.value !== undefined && originalLayout !== null) {
    if (layout_.value.length !== originalLayout.length) {
      let diff = findDifference(layout_.value, originalLayout);
      if (diff.length > 0) {
        if (layout_.value.length > originalLayout.length) {
          originalLayout = originalLayout.concat(diff);
        } else {
          originalLayout = originalLayout.filter((obj) => {
            return !diff.some((obj2) => obj.i === obj2.i);
          });
        }
      }
      lastLayoutLength = layout_.value.length;
      initResponsiveFeatures();
    }
    compact(layout_.value, props.verticalCompact);
    eventBus.emit('updateWidth', width.value);
    updateHeight();
    $emit('layout-updated', layout_.value);
  }
}

function updateHeight(): void {
  mergedStyle.value = {
    height: containerHeight(),
  };
}
function onWindowResize(): void {
  if (girdDomItem.value !== null && girdDomItem.value !== undefined) {
    width.value = girdDomItem.value?.offsetWidth;
  }
  eventBus.emit('resizeEvent');
}
function containerHeight(): string {
  if (!props.autoSize) return;
  const containerHeight =
    bottom(layout_.value) * (props.rowHeight + props.margin[1]) +
    props.margin[1] +
    'px';
  return containerHeight;
}

function dragEvent<T, ID, X, Y, H, W>(
  eventName: T,
  id: ID,
  x: X,
  y: Y,
  h: H,
  w: W
) {
  let l = getLayoutItem(layout_.value, id);
  if (l === undefined || l === null) {
    l = { x: 0, y: 0 };
  }
  if (eventName === 'dragmove' || eventName === 'dragstart') {
    placeholder.i = id;
    placeholder.x = l?.x;
    placeholder.y = l?.y;
    placeholder.w = l?.w;
    placeholder.h = l?.h;
    nextTick(() => {
      isDragging.value = true;
    });
    eventBus.emit('updateWidth', width.value);
  } else {
    nextTick(() => {
      isDragging.value = false;
    });
  }
  layout_.value = moveElement(
    layout_.value,
    l,
    x,
    y,
    true,
    props.preventCollision
  );
  compact(layout_.value, props.verticalCompact);
  eventBus.emit('compact');
  updateHeight();
  if (eventName === 'dragend') $emit('layout-updated', layout_.value);
}

function resizeEvent<T, ID, X, Y, H, W>(
  eventName: T,
  id: ID,
  x: X,
  y: Y,
  h: H,
  w: W
): void {
  let l = getLayoutItem(layout_.value, id) || { h: 0, w: 0 };
  let hasCollisions;
  if (props.preventCollision) {
    const collisions = getAllCollisions(layout_.value, { ...l, w, h }).filter(
      (layoutItem) => layoutItem.i !== l.i
    );
    hasCollisions = collisions.length > 0;

    if (hasCollisions) {
      let leastX = Infinity;
      let leastY = Infinity;
      collisions.forEach((layoutItem) => {
        if (layoutItem.x > l?.x) leastX = Math.min(leastX, layoutItem.x);
        if (layoutItem.y > l?.y) leastY = Math.min(leastY, layoutItem.y);
      });

      if (Number.isFinite(leastX)) l.w = leastX - l.x;
      if (Number.isFinite(leastY)) l.y = leastY - l.y;
    }
  }
  if (!hasCollisions) {
    l.w = w;
    l.h = h;
  }

  if (eventName === 'resizestart' || eventName === 'resizemove') {
    placeholder.i = id;
    placeholder.x = x;
    placeholder.y = y;
    placeholder.w = l?.w;
    placeholder.h = l?.h;    
    nextTick(() => {
      isDragging.value = true;
    });
    eventBus.emit('updateWidth', width.value);
  } else {
    nextTick(() => {
      isDragging.value = false;
    });
  }
  if (props.responsive) responsiveGridLayout();
  compact(layout_.value, props.verticalCompact);

  eventBus.emit('compact');
  updateHeight();
  if (eventName === 'resizeend') {
    $emit('layout-updated', layout_.value);
    $emit('update:layout', layout_.value);
  }
}

function responsiveGridLayout(): void {
  let newBreakpoint = getBreakpointFromWidth(props.breakpoints, width.value);
  let newClos = getColsFromBreakpoint(newBreakpoint, props.cols);

  if (lastBreakpoint.value != null || layout_.value[lastBreakpoint.value]) {
    layouts[lastBreakpoint.value] = cloneLayout(layout_.value);
  }

  let layout = findOrGenerateResponsiveLayout(
    originalLayout,
    layouts,
    props.breakpoints,
    newBreakpoint,
    lastBreakpoint.value,
    newClos,
    props.verticalCompact
  );
  layouts[newBreakpoint] = layout;

  if (lastBreakpoint.value !== newBreakpoint) {
    $emit('breakpoint-changed', newBreakpoint, layout);
  }

  $emit('update:layout', layout);
  lastBreakpoint.value = newBreakpoint;
  eventBus.emit('setColNum', getColsFromBreakpoint(newBreakpoint, props.cols));
}

function initResponsiveFeatures(): void {
  layouts = Object.assign({}, props.responsiveLayouts);
}
function findDifference(layout, originalLayout): Array<any> {
  let uniqueResultOne = props.layout.filter((obj) => {
    return !originalLayout.some((obj2) => {
      return obj.i === obj2.i;
    });
  });

  let uniqueResultTwo = originalLayout.filter((obj) => {
    return !props.layout.some((obj2) => {
      return obj.i === obj2.i;
    });
  });
  return uniqueResultOne.concat(uniqueResultTwo);
}
</script>

<style>
.vue-grid-layout {
  position: relative;
  transition: height 200ms ease;
}
</style>
