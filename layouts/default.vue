<template>
  <div class="layout-container">
    <header>
      <h1>Nuxt ToDo App</h1>
    </header>
    <main>
      <!-- ページの内容がここにレンダリングされる -->
      <NuxtPage />
    </main>
    <footer>
      <p>© 2024 Nuxt ToDo App</p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
// レイアウト用のスクリプトが必要であればここに追加
</script>

<style scoped>
.layout-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
header {
  text-align: center;
  margin-bottom: 20px;
}
footer {
  text-align: center;
  margin-top: 20px;
}
</style>
