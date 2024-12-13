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
          @drag-start="operations.onDragStart"
          @drag-over="operations.onDragOver"
          @drop="operations.onDrop"
          @edit-task="operations.openEditModal"
        />
      </div>

      <Pagination
        :current-page="taskState.state.currentPage"
        :total-pages="taskState.totalPages"
        @change-page="page => taskState.state.currentPage = page"
      />
    </div>
  </div>

  <EditModal
    :is-edit-modal-visible="taskState.state.isEditModalVisible"
    :current-edit-task="taskState.state.currentEditTask"
    @close-edit-modal="operations.closeEditModal"
    @save-edit-task="operations.saveEditTask"
    @update:current-edit-task="value => taskState.state.currentEditTask = value"
  />

  <ToastNotification
    :show-toast="taskState.showToast"
    :toast-type="taskState.toastType"
    :toast-message="taskState.toastMessage"
    @close="taskState.showToast = false"
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

const { taskState, operations } = useTasks();
</script>

<style scoped>
.task-container {
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
