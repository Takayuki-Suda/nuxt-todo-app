import { ref } from 'vue';
import type { Ref } from 'vue';
import type { TaskState } from '~/types/task';

export function useTaskDragDrop(
  state: Ref<TaskState>,
  saveTasks: () => void
) {
  const draggedTaskIndex = ref<number | null>(null);
  const draggingTaskIndex = ref<number | null>(null);
  const dragDirection = ref<"up" | "down" | "">("");

  const onDragStart = (index: number) => {
    const fullIndex = index + (state.value.currentPage - 1) * state.value.tasksPerPage;
    draggedTaskIndex.value = fullIndex;
    draggingTaskIndex.value = fullIndex;
  };

  const onDragOver = (index: number) => {
    const fullIndex = index + (state.value.currentPage - 1) * state.value.tasksPerPage;

    if (draggedTaskIndex.value !== null) {
      dragDirection.value = fullIndex < draggedTaskIndex.value ? "up" : "down";
      draggingTaskIndex.value = fullIndex;
    }
  };

  const onDrop = (index: number) => {
    if (draggedTaskIndex.value !== null && draggingTaskIndex.value !== null) {
      const draggedTask = state.value.tasks[draggedTaskIndex.value];
      const targetIndex = index + (state.value.currentPage - 1) * state.value.tasksPerPage;

      state.value.tasks.splice(draggedTaskIndex.value, 1);
      state.value.tasks.splice(targetIndex, 0, draggedTask);

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