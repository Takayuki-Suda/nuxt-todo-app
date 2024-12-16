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
      <div>
        <input
          type="checkbox"
          class="form-check-input me-3"
          :checked="state.selectedTasks.includes(getFullIndex(index))"
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
import { useTaskDragDrop } from "~/composables/task/useTaskDragDrop";
import { ref } from "vue";
import type { TaskState, Task } from "~/types/task";

// props の定義
const props = defineProps<{
  state: TaskState;
  paginatedTasks: Task[];
}>();

const emit = defineEmits<{
  editTask: [index: number];
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

// ドラッグ終了時に状態をリセット
const onDragEnd = () => {
  draggedTaskIndex.value = null;
  draggingTaskIndex.value = null;
  dragDirection.value = "";
};
</script>

<style scoped>
@import "@/assets/css/dragging-style.css";
</style>
