// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  css: ["@/assets/styles.css", "bootstrap/dist/css/bootstrap.min.css"], // 必要ならCSSファイルを追加
});
