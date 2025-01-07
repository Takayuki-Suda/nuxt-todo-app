export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  css: ["@/assets/styles.css", "bootstrap/dist/css/bootstrap.min.css"], // 必要ならCSSファイルを追加
  plugins: ["~/plugins/toastification.js"], // プラグインを追加
  modules: [
    "@nuxt/test-utils/module", // 追加
  ],
});
