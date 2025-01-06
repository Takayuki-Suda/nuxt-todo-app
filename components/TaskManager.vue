<template>
  <div class="row">
    <div class="col-12">
      <TaskInput
        v-model="taskState.state.newTask"
        @add-task="operations.addTask"
        @clear-input="operations.clearInput"
      />

      <div class="task-container border p-3">
        <TaskControls
          :selected-tasks-count="taskState.state.selectedTasks.length"
          :tasks-per-page="taskState.state.tasksPerPage"
          :task-display-options="taskState.taskDisplayOptions"
          @remove-selected-tasks="operations.removeSelectedTasks"
          @deselect-all-tasks="operations.deselectAllTasks"
        />

        <TaskList
          :state="taskState.state"
          :paginated-tasks="taskState.paginatedTasks"
          :dragged-task-index="taskState.draggedTaskIndex"
          :dragging-task-index="taskState.draggingTaskIndex"
          :drag-direction="taskState.dragDirection"
          :tasks-per-page="taskState.state.tasksPerPage"
          :task-display-options="taskState.taskDisplayOptions"
          @showDetails="openDetails"
          @drag-start="operations.onDragStart"
          @drag-over="operations.onDragOver"
          @drop="operations.onDrop"
          @edit-task="operations.openEditModal"
          @fetchTasksByDueDate="fetchTasksByDueDate"
          @update:tasksPerPage="
            (value) => (taskState.state.tasksPerPage = value)
          "
        />
      </div>

      <Pagination
        :current-page="taskState.state.currentPage"
        :total-pages="taskState.totalPages"
        @change-page="(page) => (taskState.state.currentPage = page)"
      />
    </div>
  </div>

  <EditModal
    v-if="taskState.state.currentEditTask"
    :is-edit-modal-visible="taskState.state.isEditModalVisible"
    :current-edit-task="taskState.state.currentEditTask"
    @close-edit-modal="operations.closeEditModal"
    @save-edit-task="operations.saveEditTask"
    @update:current-edit-task="(value: Task) => (taskState.state.currentEditTask = value)"
  />

  <ToastNotification
    :show-toast="taskState.showToast"
    :toast-type="taskState.toastType"
    :toast-message="taskState.toastMessage"
    @close="taskState.showToast = false"
  />

  <TaskDetailsModal
    v-if="taskState.state.selectedTask"
    :task="taskState.state.selectedTask"
    @close="taskState.state.selectedTask = null"
    @editTask="openEditFromDetails"
  />
</template>

<script setup lang="ts">
import { useTasks } from "../composables/useTasks";
import TaskInput from "./TaskInput.vue";
import TaskControls from "./TaskControls.vue";
import TaskList from "./TaskList.vue";
import ToastNotification from "./ToastNotification.vue";
import Pagination from "./Pagination.vue";
import EditModal from "./EditModal.vue";
import TaskDetailsModal from "./TaskDetailsModal.vue";
import type { Task } from "~/types/task";
import axios from "axios"; // ここでaxiosをインポート

defineProps({
  task: {
    type: Object,
    default: () => null, // nullが渡されてもエラーにならないように
  },
});

const { taskState, operations } = useTasks();

// 詳細ボタンが押された時の処理
const openDetails = (index: number) => {
  const actualIndex =
    index + (taskState.state.currentPage - 1) * taskState.state.tasksPerPage;
  const task = taskState.state.tasks[actualIndex]; // 選択されたタスクを取得
  taskState.state.selectedTask = task; // 選択タスクを保存
};

// 詳細ダイアログから編集ダイアログを開く処理
const openEditFromDetails = (task: Task) => {
  taskState.state.currentEditTask = task;
  taskState.state.isEditModalVisible = true;
  taskState.state.selectedTask = null; // 詳細ダイアログを閉じる
};

const fetchTasksByDueDate = async (dueDate: string) => {
  console.log("fetchTasksByDueDate called with dueDate:", dueDate);
  try {
    const response = await axios.get(
      `http://localhost:5000/api/tasks/dueDate`,
      {
        params: { due_date: dueDate },
      }
    );

    if (response.status === 200) {
      console.log("取得したレスポンス:", response.data);
      taskState.state.tasks = response.data.tasks; // 検索結果をtasksに設定
      taskState.state.paginatedTasks = response.data.tasks;

      console.log("設定されたタスク:", taskState.state.paginatedTasks);

      taskState.state.currentPage = 1;
    } else {
      console.error("APIからの応答が不正です:", response);
      alert("タスクの取得に失敗しました。APIからの応答が不正です。");
    }
  } catch (error) {
    console.error("タスクの取得に失敗しました:", error);
    alert("タスクの取得に失敗しました。");
  }
};
</script>

<style scoped>
@import "@/assets/css/task-container-style.css";
</style>
