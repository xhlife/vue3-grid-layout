# Support By

This project js support by [vue-grid-layout](https://github.com/jbaysolutions/vue-grid-layout), but vue-grid-layout do not support vue3.

# Vue 3 + TypeScript + Vite

 The template uses Vue 3 `<script setup>` SFCs, so pay attention to the version of vue.

## Supports Vue 3.2+

# Usage

```shell
npm i vue3-grid-layout-next
```

<h2>
  <a href="https://jbaysolutions.github.io/vue-grid-layout/" target="_blank">Documentation Website</a>
</h2>

## add Scoped slot
```html
<grid-item v-slot="{style}">
  <div>
    <!-- get attribute, such as width,height, and so no  -->
    {{ style }}
  </div>
</grid-item>
```

## beware

### Usage with v-model

```html
 <GridLayout v-model:layout="layout">
  ...
 </GridLayout>
```

### Use ref object

If the responsive property is true, make sure layout is a ref object

```html
<script lang="ts" setup> 

  const responsive = ref(true)
  const layout = ref([])
  // const layout = reactive([]) // will cause some bug

  // it will work, when responsive is false
  // const layout = reactive([])

</script>

<template>
  <div class="layout">
    <GridLayout v-model:layout="layout" :responsive="responsive" >
      ...
    </GridLayout>
  </div>
</template>
```

# example 

[demo for echart](https://cxid.gitee.io/works/work/vue3-grid-layout/index.html)


