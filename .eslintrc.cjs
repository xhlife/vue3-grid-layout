module.exports = {
  root: true,

  // https://github.com/vuejs/vue-eslint-parser#parseroptionsparser
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    // https://github.com/vuejs/eslint-plugin-vue/blob/44ff0e02cd0fd08b8cd7dee0127dbb5590446323/docs/user-guide/README.md#conflict-with-prettier
    "plugin:vue/vue3-recommended",
    "prettier"
  ],
  rules: {
    "prettier/prettier": "warn",
    semi: [2, "never"],
    "@typescript-eslint/no-explicit-any": "off", //关闭any类型警告
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-var-requires": "warn", // 允许common.js方式引入
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["index"]
      }
    ]
  }
}
