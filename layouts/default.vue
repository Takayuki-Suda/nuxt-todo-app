<template>
  <div class="layout-container">
    <header>
      <h1 class="title">Nuxt ToDo App</h1>
    </header>
    <main>
      <!-- ページの内容がここにレンダリングされる -->
      <NuxtPage />
    </main>
    <footer>
      <p>© 2024 Suda. All rights reserved.</p>
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
  margin-bottom: -30px;
}

.title {
  font-size: 3rem; /* 少し大きくして存在感を強調 */
  font-weight: 600; /* 重さを軽くし、シャープな印象に */
  color: #34495e; /* 少し暗めで落ち着きのある色に変更 */
  letter-spacing: -0.5px; /* 文字間隔を狭めて密度を高める */
  text-transform: uppercase; /* 大文字にして、エネルギッシュな印象 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 微妙な影を加えて立体感を強調 */
  line-height: 1.2; /* 行間を少し狭くしてコンパクトに */
}

footer {
  text-align: center;
  margin-top: -55px;
}
</style>
