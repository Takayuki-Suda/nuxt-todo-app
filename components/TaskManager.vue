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
          v-model:tasks-per-page="taskState.state.tasksPerPage"
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
          @showDetails="openDetails"
          @drag-start="operations.onDragStart"
          @drag-over="operations.onDragOver"
          @drop="operations.onDrop"
          @edit-task="operations.openEditModal"
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
</script>

<style scoped>
@import "@/assets/css/task-container-style.css";
</style>
