<template>
  <div class="list-group">
    <div
      v-for="(task, index) in paginatedTasks"
      :key="task.text"
      class="list-group-item d-flex align-items-center justify-content-between position-relative"
      draggable="true"
      :class="[
        getDraggingClasses(index),
        { 'selected-task': isSelected(index) },
      ]"
      @click="handleTaskClick(index)"
      @dragstart="onDragStart(index)"
      @dragover.prevent="onDragOver(index)"
      @drop="onDrop(index)"
      @dragend="onDragEnd"
    >
      <div class="d-flex w-100 align-items-center">
        <!-- タスク名左側に完了チェックボックス -->
        <input
          type="checkbox"
          class="form-check-input me-3"
          :checked="task.completed"
          @change="toggleTaskCompletion(index, $event.target.checked)"
        />

        <div class="task-text-container">
          <span :class="{ 'text-decoration-line-through': task.completed }">
            {{ task.text }}
          </span>
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

// タスクが選択されているかどうかを判定する関数
const isSelected = (index: number) => {
  const actualIndex = getFullIndex(index);
  return props.state.selectedTasks.includes(actualIndex);
};

// タスクをクリックしたときに選択を切り替える
const handleTaskClick = (index: number) => {
  // チェックボックスがクリックされていない場合のみ選択状態を切り替える
  if (event.target.type !== "checkbox") {
    updateSelectedTasks(index);
  }
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

// 完了・未完了チェックボックスをクリックしたときにタスクを完了/未完了に切り替える
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
      return "bg-delay";
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

/* 選択されたタスクに色を付ける */
.selected-task {
  background-color: #d1e7dd; /* 選択されたタスクの背景色 */
}

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

/* 遅延のエフェクト */
@keyframes flameEffect {
  0%,
  100% {
    box-shadow: 0 0 10px 2px rgba(255, 69, 0, 0.8),
      0 0 20px 4px rgba(255, 140, 0, 0.6);
    transform: translateY(0) scale(1);
  }
  50% {
    box-shadow: 0 0 15px 4px rgba(255, 0, 0, 0.9),
      0 0 30px 6px rgba(255, 69, 0, 0.7);
    transform: translateY(-3px) scale(1.05);
  }
}

/* 遅延クラス */
.bg-delay {
  background-color: red !important;
  color: white;
  animation: flameEffect 1.5s infinite ease-in-out;
  position: relative;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
}

/* 遅延の装飾 */
.bg-delay::after {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 1.5rem;
  animation: flameEffect 1.5s infinite ease-in-out;
}
</style>
