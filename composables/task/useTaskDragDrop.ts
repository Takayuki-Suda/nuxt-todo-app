import { ref } from 'vue';
import type { Ref } from 'vue';

export function useTaskDragDrop(
  tasks: Ref<{ text: string; completed: boolean }[]>,
  currentPage: Ref<number>,
  tasksPerPage: Ref<number>,
  saveTasks: () => void
) {
  const draggedTaskIndex = ref<number | null>(null);
  const draggingTaskIndex = ref<number | null>(null);
  const dragDirection = ref<"up" | "down" | "">("");

  const onDragStart = (index: number) => {
    const fullIndex = index + (currentPage.value - 1) * tasksPerPage.value;
    draggedTaskIndex.value = fullIndex;
    draggingTaskIndex.value = fullIndex;
  };

  const onDragOver = (index: number) => {
    const fullIndex = index + (currentPage.value - 1) * tasksPerPage.value;

    if (draggedTaskIndex.value !== null) {
      dragDirection.value = fullIndex < draggedTaskIndex.value ? "up" : "down";
      draggingTaskIndex.value = fullIndex;
    }
  };

  const onDrop = (index: number) => {
    if (draggedTaskIndex.value !== null && draggingTaskIndex.value !== null) {
      const draggedTask = tasks.value[draggedTaskIndex.value];
      const targetIndex = index + (currentPage.value - 1) * tasksPerPage.value;

      tasks.value.splice(draggedTaskIndex.value, 1);
      tasks.value.splice(targetIndex, 0, draggedTask);

      saveTasks();
    }
    draggedTaskIndex.value = null;
    draggingTaskIndex.value = null;
    dragDirection.value = "";
  };

  return {
    draggedTaskIndex,
    draggingTaskIndex,
    dragDirection,
    onDragStart,
    onDragOver,
    onDrop,
  };
} 