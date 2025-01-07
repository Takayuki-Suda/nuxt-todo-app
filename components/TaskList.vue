<template>
  <div class="mb-3">
    <!-- ボタン表示選択セレクトボックス -->
    <select v-model="selectedAction" class="form-select form-select-sm mb-3">
      <option value="">-</option>
      <option value="sort">期限順に並べ替え</option>
      <option value="deleteCompleted">完了済みタスクを一括削除</option>
      <option value="search">タスクを検索</option>
    </select>

    <div class="d-flex">
      <!-- 並べ替えボタン -->
      <button
        class="btn btn-primary"
        @click="sortTasksByDueDate"
        v-if="selectedAction === 'sort'"
      >
        期限順に並べ替え
      </button>

      <!-- 完了済みタスク削除ボタン -->
      <button
        class="btn btn-danger"
        @click="deleteCompletedTasks"
        v-if="selectedAction === 'deleteCompleted'"
      >
        完了済みタスクを一括削除
      </button>

      <!-- 期限日入力フォーム -->
      <form
        @submit.prevent="emitFetchTasksByDueDate"
        v-if="selectedAction === 'search'"
        class="d-flex align-items-center me-3"
      >
        <div class="me-3">
          <label for="due-date">締切:</label>
          <input
            v-model="dueDate"
            type="date"
            id="due-date"
            name="due-date"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary custom-height me-3">
          検索
        </button>
        <button
          type="button"
          class="btn btn-secondary custom-height"
          @click="clearFilter"
        >
          クリア
        </button>
      </form>
      <!-- 件数セレクトボックス -->
      <select
        id="tasksPerPage"
        class="form-select form-select-sm custom-width custom-height ms-auto"
        :value="tasksPerPage"
        @change="updateTasksPerPage($event)"
      >
        <option
          v-for="option in taskDisplayOptions"
          :key="option"
          :value="option"
        >
          {{ option }} 件
        </option>
      </select>
    </div>
  </div>
  <!-- カラムヘッダーを追加 -->
  <div class="list-group-header d-flex justify-content-between">
    <div class="column-header">タスク名</div>
    <div class="column-header">締切</div>
    <div class="column-header">緊急度</div>
    <div class="column-header">操作</div>
  </div>

  <div
    class="list-group"
    :class="{
      'bg-delay-parent': hasDelayedTasks(),
    }"
  >
    <div
      v-for="(task, index) in paginatedTasks"
      :key="task.text"
      class="list-group-item d-flex align-items-center justify-content-between position-relative"
      draggable="true"
      :class="[
        getDraggingClasses(index),
        {
          'selected-task': isSelected(index),
          'completed-task': task.completed,
        },
      ]"
      @click="handleTaskClick(index)"
      @dragstart="onDragStart(index)"
      @dragover.prevent="onDragOver(index)"
      @drop="onDrop(index)"
      @dragend="onDragEnd"
    >
      <div class="d-flex w-100 align-items-center justify-content-between">
        <!-- チェックボックスを押せないように修正 -->
        <input
          type="checkbox"
          class="form-check-input me-3"
          :checked="task.completed"
          :disabled="true"
        />

        <div class="task-text-container flex-grow-1">
          <span :class="{ 'text-decoration-line-through': task.completed }">
            {{ truncateText(task.text) }}
          </span>
        </div>

        <!-- 期日表示 -->
        <div class="due-date-container">
          <span class="badge bg-light text-dark">
            {{ formatDueDate(task.dueDate) }}
          </span>
        </div>

        <!-- 緊急度表示 -->
        <div class="priority-container">
          <span :class="['badge', getPriorityClass(task)]">
            {{ getPriorityLabel(task) }}
          </span>
        </div>

        <!-- 詳細ボタン -->
        <button class="btn btn-secondary btn-sm" @click="showDetails(index)">
          詳細
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useTaskDragDrop } from "~/composables/task/useTaskDragDrop";
import type { TaskState, Task } from "~/types/task";
import { useToast } from "vue-toastification";
// props の定義
const props = defineProps<{
  state: TaskState;
  paginatedTasks: Task[];
  draggedTaskIndex: number | null;
  draggingTaskIndex: number | null;
  dragDirection: "up" | "down" | null;
  tasksPerPage: number;
  taskDisplayOptions: number[];
}>();

const emit = defineEmits<{
  editTask: [index: number];
  showDetails: [index: number];
  dragStart: [event: DragEvent];
  dragOver: [event: DragEvent];
  drop: [event: DragEvent];
  fetchTasksByDueDate: (dueDate: string) => void;
  "update:tasksPerPage": [value: number];
}>();

const selectedAction = ref(""); // 選択されたアクションを管理するためのref
const dueDate = ref(""); // 期限日を管理するためのref
const toast = useToast();

const emitFetchTasksByDueDate = () => {
  emit("fetchTasksByDueDate", dueDate.value);
  toast.success("期限日までのタスクを取得しました！");
};

const updateTasksPerPage = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  props.state.currentPage = 1;
  emit("update:tasksPerPage", Number(target.value));
};

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
  onDrop: originalOnDrop,
} = useTaskDragDrop(ref(props.state), () => {
  // タスク保存処理をここで定義
  console.log("Tasks saved");
});

const onDrop = (index: number) => {
  originalOnDrop(index);
  emit("drop", { index });
};

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
  const target = event.target as HTMLElement;

  // チェックボックス、編集ボタン、詳細ボタンがクリックされた場合は選択状態を切り替えない
  if (
    target.type === "checkbox" ||
    target.classList.contains("btn-info") ||
    target.classList.contains("btn-secondary")
  ) {
    return;
  }
  // 完了したタスクの場合は選択を切り替えない
  if (props.paginatedTasks[index].completed) {
    return;
  }

  updateSelectedTasks(index);
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

const clearFilter = () => {
  dueDate.value = "";
  loadTasks(); // タスクのリストを再取得してフィルタをクリア
  toast.success("期限日フィルターをクリアしました！");
};

// 遅延しているタスクが一つ以上あるか判定する関数
const hasDelayedTasks = () => {
  return props.paginatedTasks.some((task) => getPriorityLabel(task) === "遅延");
};

// タスクを期限順に並べ替える関数
const sortTasksByDueDate = async () => {
  try {
    // バックエンドに並べ替えリクエストを送信
    const response = await axios.put(
      "http://localhost:5000/api/tasks/sort_by_due_date"
    );

    if (response.status === 200) {
      // 並べ替えが成功したら、タスクを再取得して更新
      loadTasks();
      props.state.currentPage = 1; // 並べ替え後にページを最初に戻す
      toast.success("タスクが期限順に並べ替えられました！");
    }
  } catch (error) {
    console.error("タスクの並べ替えに失敗しました:", error);
    toast.error("タスクの並べ替えに失敗しました。");
  }
};

// タスクの取得
const loadTasks = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/tasks");
    props.state.tasks = response.data;
    props.state.paginatedTasks = response.data;
  } catch (error) {
    console.error("フィルターのクリアに失敗しました:", error);
  }
};

// ページを更新する関数
const reloadPage = () => {
  window.location.reload();
};

// 期日を表示するための日付フォーマット関数
const formatDueDate = (dueDate: string) => {
  const date = new Date(dueDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleDateString("ja-JP", options);
};

// 完了済みタスクを一括削除する処理
const deleteCompletedTasks = async () => {
  try {
    const response = await axios.delete(
      "http://localhost:5000/api/tasks/completed"
    );

    if (response.status === 200) {
      loadTasks();
      props.state.currentPage = 1; // 並べ替え後にページを最初に戻す
      toast.success("完了済みタスクが削除されました！");
    }
  } catch (error) {
    console.error("完了済みタスクの削除に失敗しました:", error);
    toast.error("完了済みタスクの削除に失敗しました。");
  }
};

const fetchTasksByDueDate = async (event: SubmitEvent) => {
  event.preventDefault(); // フォームのデフォルト動作を防ぐ

  try {
    const dueDateValue = dueDate.value; // 入力された期限日を取得
    if (!dueDateValue) {
      toast.error("期限日を入力してください");
      return;
    }

    // APIリクエストを送信
    const response = await axios.get(
      `http://localhost:5000/api/tasks/due-date`,
      {
        params: { due_date: dueDateValue }, // 期限日をクエリパラメータとして送信
      }
    );

    if (response.status === 200) {
      toast.success("タスクの取得に成功しました");
      console.log("取得したレスポンス:", response.data);
      props.state.tasks = response.data.tasks; // 検索結果をtasksに設定
      props.state.paginatedTasks = response.data.tasks;

      // コンソールログで確認
      console.log("設定されたタスク:", props.state.paginatedTasks);

      // ページ番号をリセット
      props.state.currentPage = 1;
    } else {
      console.error("APIからの応答が不正です:", response);
      alert("タスクの取得に失敗しました。APIからの応答が不正です。");
    }
  } catch (error) {
    console.error("タスクの取得に失敗しました:", error);
    alert("タスクの取得に失敗しました。");
  }
};

// テキストを8文字以上の場合に7文字目で止めて「...」にする関数
const truncateText = (text: string) => {
  if (!text) return "";
  return text.length > 7 ? text.slice(0, 7) + "..." : text;
};
</script>

<style scoped>
@import "@/assets/css/dragging-style.css";
@import "@/assets/css/form-select-style.css";

/* カラムヘッダーのスタイル */
.list-group-header {
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
}

.column-header {
  flex: 1;
  font-weight: bold;
}

.column-header:nth-child(1) {
  margin-left: 30px;
}

.column-header:nth-child(2) {
  margin-left: 40px;
}
.column-header:nth-child(3) {
  margin-left: 10px;
}
.column-header:nth-child(4) {
  margin-right: -62px;
}

/* 選択されたタスクに色を付ける */
.selected-task {
  background-color: #d1e7dd; /* 選択されたタスクの背景色 */
}

/* 期日表示のスタイル */
.due-date-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
  font-size: 1.2rem; /* フォントサイズをアップ */
  font-weight: bold; /* フォントを太くする場合 */
  margin-right: 40px; /* タスクテキストとのスペースを調整 */
}

.priority-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px; /* タスクテキストとのスペースを調整 */
  min-width: 60px; /* 最小幅を指定して、並びがずれないようにする */
  margin-right: 50px; /* タスクテキストとのスペースを調整 */
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

/* 完了したタスクを青くするスタイル */
.completed-task {
  background-color: #e3f2fd; /* 薄い水色 */
  color: #1e88e5;
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

/* 親要素に遅延エフェクトを付与 */
.bg-delay-parent {
  position: relative;
  animation: flameEffect 1.5s infinite ease-in-out;
}

.custom-width {
  width: 100px;
}
.custom-height {
  height: 40px;
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
</style>
