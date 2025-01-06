import { defineNuxtPlugin } from "#app";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options = {
    position: "top-right", // トースターの表示位置を設定
    timeout: 3000, // トースターの表示時間を設定
    closeOnClick: true, // クリックで閉じる設定
    pauseOnFocusLoss: true, // フォーカスが外れたときに一時停止する設定
    pauseOnHover: true, // ホバー時に一時停止する設定
    draggable: true, // ドラッグ可能にする設定
    draggablePercent: 0.6, // ドラッグの割合を設定
    showCloseButtonOnHover: false, // ホバー時に閉じるボタンを表示する設定
    hideProgressBar: false, // プログレスバーを非表示にする設定
    closeButton: "button", // 閉じるボタンのタイプを設定
    icon: true, // アイコンを表示する設定
    rtl: false, // 右から左への表示を設定
  };

  nuxtApp.vueApp.use(Toast, options);
});
