<template>
  <div class="list-group">
    <div
      v-for="(task, index) in paginatedTasks"
      :key="task.text"
      class="list-group-item d-flex align-items-center justify-content-between position-relative"
      draggable="true"
      :class="getDraggingClasses(index)"
      @dragstart="$emit('dragStart', index)"
      @dragover.prevent="$emit('dragOver', index)"
      @drop="$emit('drop', index)"
    >
      <div>
        <input
          type="checkbox"
          class="form-check-input me-3"
          :checked="state.selectedTasks.includes(index + (state.currentPage - 1) * state.tasksPerPage)"
          @change="updateSelectedTasks(index)"
        />
        <span :class="{ 'text-decoration-line-through': task.completed }">
          {{ task.text }}
        </span>
      </div>
      <button
        class="btn btn-secondary btn-sm"
        @click="$emit('editTask', index)"
      >
        編集
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskState } from '~/types/task';

const props = defineProps<{
  state: TaskState;
  paginatedTasks: Task[];
  draggedTaskIndex: number | null;
  draggingTaskIndex: number | null;
  dragDirection: 'up' | 'down' | null | '';
}>();

const emit = defineEmits<{
  'dragStart': [index: number];
  'dragOver': [index: number];
  'drop': [index: number];
  'editTask': [index: number];
}>();

const updateSelectedTasks = (index: number) => {
  const actualIndex = index + (props.state.currentPage - 1) * props.state.tasksPerPage;
  
  const newSelectedTasks = [...props.state.selectedTasks];
  const indexInArray = newSelectedTasks.indexOf(actualIndex);
  
  if (indexInArray === -1) {
    newSelectedTasks.push(actualIndex);
  } else {
    newSelectedTasks.splice(indexInArray, 1);
  }
  
  props.state.selectedTasks = newSelectedTasks;
};

const getDraggingClasses = (index: number) => ({
  dragging: props.draggedTaskIndex === index,
  'dragging-up': props.draggingTaskIndex === index && props.dragDirection === 'up',
  'dragging-down': props.draggingTaskIndex === index && props.dragDirection === 'down',
});
</script>

<style scoped>
.dragging {
  background-color: rgba(0, 123, 255, 0.2);
  border: 2px solid #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

.dragging-up::before,
.dragging-down::after {
  content: "";
  display: block;
  position: absolute;
  height: 3px;
  background-color: red;
  left: 0;
  right: 0;
  z-index: 1;
}

.dragging-up::before {
  top: 0;
}

.dragging-down::after {
  bottom: 0;
}
</style> 