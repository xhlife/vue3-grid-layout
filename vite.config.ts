import {defineConfig} from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"
import libCss from "vite-plugin-libcss"
import dts from "vite-plugin-dts"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), libCss(), dts()],
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "./src/components/index.ts"), //指定组件编译入口文件
      name: "vue3-gird-layout",
      fileName: "vue3-grid-layout",
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: ["vue"],

      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  },
  server: {
    port: 8787
  }
})
