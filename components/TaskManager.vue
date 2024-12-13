<template>
  <div class="row">
    <div class="col-12">
      <TaskInput
        v-model="newTask"
        @add-task="addTask"
        @clear-input="clearInput"
      />

      <div class="task-container border p-3">
        <TaskControls
          :selected-tasks-count="selectedTasks.length"
          v-model:tasks-per-page="tasksPerPage"
          :task-display-options="taskDisplayOptions"
          @remove-selected-tasks="removeSelectedTasks"
          @deselect-all-tasks="deselectAllTasks"
          @update:tasks-per-page="(value) => { tasksPerPage = value; resetPage(); }"
        />

        <TaskList
          :tasks="paginatedTasks"
          :selected-tasks="selectedTasks"
          :dragged-task-index="draggedTaskIndex"
          :dragging-task-index="draggingTaskIndex"
          :drag-direction="dragDirection"
          :current-page="currentPage"
          :tasks-per-page="tasksPerPage"
          @drag-start="onDragStart"
          @drag-over="onDragOver"
          @drop="onDrop"
          @edit-task="openEditModal"
          @update:selected-tasks="selectedTasks = $event"
        />
      </div>

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change-page="changePage"
      />
    </div>
  </div>

  <EditModal
    :is-edit-modal-visible="isEditModalVisible"
    :current-edit-task="currentEditTask"
    @close-edit-modal="closeEditModal"
    @save-edit-task="saveEditTask"
    @update:current-edit-task="currentEditTask = $event"
  />

  <ToastNotification
    :show-toast="showToast"
    :toast-type="toastType"
    :toast-message="toastMessage"
    @close="showToast = false"
  />
</template>

<script setup lang="ts">
import { useTasks } from "../composables/useTasks";
import TaskInput from './TaskInput.vue';
import TaskControls from './TaskControls.vue';
import TaskList from './TaskList.vue';
import ToastNotification from './ToastNotification.vue';
import Pagination from './Pagination.vue';
import EditModal from './EditModal.vue';

const {
  tasks,
  newTask,
  showToast,
  toastType,
  toastMessage,
  selectedTasks,
  isEditModalVisible,
  currentEditTaskIndex,
  currentEditTask,
  currentPage,
  tasksPerPage,
  taskDisplayOptions,
  draggedTaskIndex,
  draggingTaskIndex,
  dragDirection,
  totalPages,
  paginatedTasks,
  addTask,
  changePage,
  removeSelectedTasks,
  openEditModal,
  closeEditModal,
  saveEditTask,
  showToastMessage,
  saveTasks,
  deselectAllTasks,
  clearInput,
  resetPage,
  onDragStart,
  onDragOver,
  onDrop,
} = useTasks();
</script>

<style scoped>
.task-container {
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
