import { ref } from "vue";
import type { Ref } from "vue";
import type { TaskState } from "~/types/task";
import axios from "axios";

// タスクのドラッグ＆ドロップ用のカスタムフック
export function useTaskDragDrop(state: Ref<TaskState>) {
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

    // ドラッグしたタスクのorderを出力
    if (draggedTaskIndex.value !== null) {
      const draggedTask = state.value.tasks[draggedTaskIndex.value];
      console.log(
        "ドラッグしたタスクのorder:",
        draggedTask ? draggedTask.order : "タスクが見つかりません"
      );
    }
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
  const onDrop = async (index: number) => {
    if (draggedTaskIndex.value !== null && draggingTaskIndex.value !== null) {
      const draggedTask = state.value.tasks[draggedTaskIndex.value];
      const targetIndex = getFullIndex(index);

      // 並べ替え処理
      const taskToMove = state.value.tasks[draggedTaskIndex.value];

      // タスクの移動
      state.value.tasks.splice(draggedTaskIndex.value, 1);
      state.value.tasks.splice(targetIndex, 0, draggedTask);
      // orderの再計算
      state.value.tasks.forEach((task, index) => {
        task.order = index; // 新しい順番に基づいてorderを更新
      });

      // 並べ替えた後のタスク順序をコンソールに出力
      console.log("並べ替えた後のタスク順序:");
      state.value.tasks.forEach((task, index) => {
        console.log(`タスクID: ${task.id}, order: ${task.order}`);
      });

      // 変更後のタスクをサーバーに送信
      await saveTasks(state.value.tasks);
    }

    // ドラッグ状態リセット
    draggedTaskIndex.value = null;
    draggingTaskIndex.value = null;
    dragDirection.value = "";
  };

  // タスク順序をサーバーに保存する関数
  const saveTasks = async (tasks: TaskState["tasks"]) => {
    console.log("送信するタスクの順序:", tasks); // ログで確認

    try {
      // 一括でタスク順序をサーバーに送信
      const response = await axios.put(
        "http://localhost:5000/api/tasks/order",
        tasks.map((task) => ({
          id: task.id,
          order: task.order,
        })),
        {
          timeout: 5000, // タイムアウト設定を追加
        }
      );

      console.log("タスクの順序が保存されました:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("タスク順序の保存に失敗しました:", error.message);
      } else {
        console.error("タスク順序の保存に失敗しました:", error);
      }
    }
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
