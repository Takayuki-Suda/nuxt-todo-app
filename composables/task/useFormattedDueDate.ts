// src/composables/useFormattedDueDate.ts
import { ref, watch } from "vue";

// formattedDueDateを管理するカスタムフック
export function useFormattedDueDate(initialDueDate: string) {
  const formattedDueDate = ref("");

  watch(
    () => initialDueDate,
    (newDueDate) => {
      if (newDueDate) {
        const date = new Date(newDueDate);
        formattedDueDate.value = date.toISOString().split("T")[0]; // YYYY-MM-DD形式
      }
    },
    { immediate: true }
  );

  return {
    formattedDueDate,
  };
}
