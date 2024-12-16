<template>
  <div class="list-group">
    <div
      v-for="(task, index) in paginatedTasks"
      :key="task.text"
      class="list-group-item d-flex align-items-center justify-content-between position-relative"
      draggable="true"
      :class="getDraggingClasses(index)"
      @dragstart="onDragStart(index)"
      @dragover.prevent="onDragOver(index)"
      @drop="onDrop(index)"
      @dragend="onDragEnd"
    >
      <div class="d-flex w-100 align-items-center">
        <!-- タスク選択チェックボックス -->
        <input
          type="checkbox"
          class="form-check-input me-3"
          :checked="state.selectedTasks.includes(getFullIndex(index))"
          @change="updateSelectedTasks(index)"
        />
        <div class="task-text-container">
          <span :class="{ 'text-decoration-line-through': task.completed }">
            {{ task.text }}
          </span>
        </div>

        <!-- 完了・未完了 ラジオボタン -->
        <div class="d-flex me-3">
          <input
            type="radio"
            class="form-check-input me-1"
            :checked="task.completed"
            @change="toggleTaskCompletion(index, true)"
          />
          <label>完了</label>
          <input
            type="radio"
            class="form-check-input me-1 ms-3"
            :checked="!task.completed"
            @change="toggleTaskCompletion(index, false)"
          />
          <label>未完了</label>
        </div>

        <!-- 詳細ボタン -->
        <button class="btn btn-info btn-sm ms-3" @click="showDetails(index)">
          詳細
        </button>

        <!-- 編集ボタン -->
        <button
          class="btn btn-secondary btn-sm ms-3"
          @click="$emit('editTask', index)"
        >
          編集
        </button>

        <!-- 緊急度表示 -->
        <div class="priority-container ms-3">
          <span :class="['badge', getPriorityClass(task)]">
            {{ getPriorityLabel(task) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTaskDragDrop } from "~/composables/task/useTaskDragDrop";
import type { TaskState, Task } from "~/types/task";

// props の定義
const props = defineProps<{
  state: TaskState;
  paginatedTasks: Task[];
}>();

const emit = defineEmits<{
  editTask: [index: number];
  showDetails: [index: number]; // showDetails イベントを追加
}>();

// ページネーションを考慮したタスクインデックスを計算
const getFullIndex = (index: number) => {
  return index + (props.state.currentPage - 1) * props.state.tasksPerPage;
};

// タスクのドラッグアンドドロップ処理のセットアップ
const {
  draggedTaskIndex,
  draggingTaskIndex,
  dragDirection,
  onDragStart,
  onDragOver,
  onDrop,
} = useTaskDragDrop(ref(props.state), () => {
  // タスク保存処理をここで定義
  console.log("Tasks saved");
});

// ドラッグしているタスクに適用するクラスを取得
const getDraggingClasses = (index: number) => ({
  dragging: draggedTaskIndex.value === getFullIndex(index),
  "dragging-up":
    draggingTaskIndex.value === getFullIndex(index) &&
    dragDirection.value === "up",
  "dragging-down":
    draggingTaskIndex.value === getFullIndex(index) &&
    dragDirection.value === "down",
});

// タスク選択更新処理
const updateSelectedTasks = (index: number) => {
  const actualIndex = getFullIndex(index);
  const newSelectedTasks = [...props.state.selectedTasks];
  const indexInArray = newSelectedTasks.indexOf(actualIndex);

  if (indexInArray === -1) {
    newSelectedTasks.push(actualIndex);
  } else {
    newSelectedTasks.splice(indexInArray, 1);
  }

  props.state.selectedTasks = newSelectedTasks;
};

// 詳細ボタンが押されたときにイベントを発火
const showDetails = (index: number) => {
  emit("showDetails", index);
};

// ドラッグ終了時に状態をリセット
const onDragEnd = () => {
  draggedTaskIndex.value = null;
  draggingTaskIndex.value = null;
  dragDirection.value = "";
};

// 完了・未完了ラジオボタンをクリックしたときにタスクを完了/未完了に切り替える
const toggleTaskCompletion = (index: number, isCompleted: boolean) => {
  const task = props.paginatedTasks[index];
  task.completed = isCompleted; // 完了状態を切り替える
};

// 緊急度に基づくクラスを返す関数
const getPriorityClass = (task: Task) => {
  const priority = getPriorityLabel(task);
  switch (priority) {
    case "終了":
      return "bg-dark";
    case "高":
      return "bg-danger";
    case "中":
      return "bg-warning";
    case "低":
      return "bg-success";
    case "遅延":
      return "bg-danger";
    default:
      return "";
  }
};

// 緊急度のラベルを計算する関数
const getPriorityLabel = (task: Task) => {
  const currentDate = new Date();
  const taskDueDate = new Date(task.dueDate);
  const timeDiff = taskDueDate.getTime() - currentDate.getTime();
  const dayDiff = timeDiff / (1000 * 3600 * 24); // ミリ秒を日数に変換

  if (task.completed) {
    return "終了"; // 完了したタスク
  }

  if (dayDiff < 0) {
    return "遅延"; // 締め切りが過ぎている未完了のタスク
  } else if (dayDiff <= 5) {
    return "高"; // 5日以内
  } else if (dayDiff <= 14) {
    return "中"; // 2週間以内
  } else if (dayDiff <= 30) {
    return "低"; // 1ヶ月以内
  } else {
    return "低"; // それ以上
  }
};
</script>

<style scoped>
@import "@/assets/css/dragging-style.css";

/* 緊急度表示に適用するスタイル */
.priority-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px; /* タスクテキストとのスペースを調整 */
  min-width: 60px; /* 最小幅を指定して、並びがずれないようにする */
}

.task-text-container {
  flex-grow: 1; /* タスク名が長くても横幅を広げる */
}

.badge {
  margin-top: 5px;
}

.bg-dark {
  background-color: #343a40;
}

.bg-danger {
  background-color: red;
}

.bg-warning {
  background-color: yellow;
}

.bg-success {
  background-color: green;
}
</style>
