<template>
  <div class="list-group">
    <div
      v-for="(task, index) in tasks"
      :key="task?.text || index"
      class="list-group-item d-flex align-items-center justify-content-between position-relative"
      draggable="true"
      :class="getDraggingClasses(getActualIndex(index))"
      @dragstart="$emit('dragStart', getActualIndex(index))"
      @dragover.prevent="$emit('dragOver', getActualIndex(index))"
      @drop="$emit('drop', getActualIndex(index))"
    >
      <div v-if="task">
        <input
          type="checkbox"
          class="form-check-input me-3"
          :value="getActualIndex(index)"
          :checked="selectedTasks.includes(getActualIndex(index))"
          @change="updateSelectedTasks(getActualIndex(index))"
        />
        <span :class="{ 'text-decoration-line-through': task.completed }">
          {{ task.text }}
        </span>
      </div>
      <button
        v-if="task"
        class="btn btn-secondary btn-sm"
        @click="$emit('editTask', getActualIndex(index))"
      >
        編集
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Task {
  text: string;
  completed: boolean;
}

const props = defineProps<{
  tasks: (Task | null)[];
  selectedTasks: number[];
  draggedTaskIndex: number | null;
  draggingTaskIndex: number | null;
  dragDirection: 'up' | 'down' | null | '';
  currentPage: number;
  tasksPerPage: number;
}>();

const emit = defineEmits<{
  'dragStart': [index: number];
  'dragOver': [index: number];
  'drop': [index: number];
  'editTask': [index: number];
  'update:selectedTasks': [selectedTasks: number[]];
}>();

const getActualIndex = (index: number) => {
  const start = (props.currentPage - 1) * props.tasksPerPage;
  return start + index;
};

const updateSelectedTasks = (index: number) => {
  const newSelectedTasks = [...props.selectedTasks];
  const indexInArray = newSelectedTasks.indexOf(index);
  
  if (indexInArray === -1) {
    newSelectedTasks.push(index);
  } else {
    newSelectedTasks.splice(indexInArray, 1);
  }
  
  emit('update:selectedTasks', newSelectedTasks);
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