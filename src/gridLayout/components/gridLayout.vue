<template>
  <div class="vue-grid-layout" ref="girdDomItem">
    <slot></slot>
  </div>
</template>

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
const $emit = defineEmits(['layout-created']);
const eventBus: Emitter<Events> = mitt();
const _this: ComponentPublicInstance = getCurrentInstance().ctx;

provide('eventBus', eventBus);
provide('layout', _this);
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
const layouts = reactive<{ [propName]: Layout }>({});
const layout_ = computed(() => props.layout);
const lastBreakpoint = ref<number | string | null>(null);
const originalLayout = reactive(layout_.value);

// 缩放事件
function resizeEventHandler<T>(data: T) {
  if (!data) return;
  const { eventType, i, x, y, h, w } = data;
  // resizeEvent(eventType, i, x, y, h, w);
}
// 拖拽事件
function dragEventHandler<T>(data: T) {
  if (!data) return;
  const { eventType, i, x, y, h, w } = data;
  // dragEvent(eventType, i, x, y, h, w);
}
// 监听事件
eventBus.on('resizeEvent', resizeEventHandler);
eventBus.on('dragEvent', dragEventHandler);
$emit('layout-created', layout_);

onBeforeUnmount(() => {
  eventBus.off('resizeEvent', resizeEventHandler);
  eventBus.off('dragEvent', dragEventHandler);
  // removeWindowEventListener('resize', )
})
</script>

<style>
.vue-grid-layout {
  position: relative;
  transition: height 200ms ease;
}
</style>
