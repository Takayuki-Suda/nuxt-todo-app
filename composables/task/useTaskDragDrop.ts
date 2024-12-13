import { ref } from "vue";
import type { Ref } from "vue";
import type { TaskState } from "~/types/task";

export function useTaskDragDrop(state: Ref<TaskState>, saveTasks: () => void) {
  const draggedTaskIndex = ref<number | null>(null);
  const draggingTaskIndex = ref<number | null>(null);
  const dragDirection = ref<"up" | "down" | "">("");

  // ページネーションを考慮してインデックスを計算する関数
  const getFullIndex = (index: number) => {
    return index + (state.value.currentPage - 1) * state.value.tasksPerPage;
  };

  // ドラッグ開始
  const onDragStart = (index: number) => {
    const fullIndex = getFullIndex(index);
    draggedTaskIndex.value = fullIndex;
    draggingTaskIndex.value = fullIndex;
  };

  // ドラッグ中の位置
  const onDragOver = (index: number) => {
    const fullIndex = getFullIndex(index);

    if (draggedTaskIndex.value !== null) {
      dragDirection.value = fullIndex < draggedTaskIndex.value ? "up" : "down";
      draggingTaskIndex.value = fullIndex;
    }
  };

  // ドロップ時にタスクを並べ替え
  const onDrop = (index: number) => {
    if (draggedTaskIndex.value !== null && draggingTaskIndex.value !== null) {
      const draggedTask = state.value.tasks[draggedTaskIndex.value];
      const targetIndex = getFullIndex(index);

      // タスクの並べ替え
      state.value.tasks.splice(draggedTaskIndex.value, 1);
      state.value.tasks.splice(targetIndex, 0, draggedTask);

      // タスク保存処理を呼び出し
      saveTasks();
    }

    // ドラッグ状態リセット
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
