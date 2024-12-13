import { ref } from 'vue';

export function useTaskNotification() {
  const showToast = ref(false);
  const toastType = ref("bg-success");
  const toastMessage = ref("");

  const showToastMessage = (message: string, type: string) => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, 2000);
  };

  return {
    showToast,
    toastType,
    toastMessage,
    showToastMessage,
  };
} 