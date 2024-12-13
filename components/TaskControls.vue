<template>
  <div class="mb-3 d-flex align-items-center">
    <button
      class="btn btn-danger me-3"
      @click="$emit('removeSelectedTasks')"
      :disabled="!selectedTasksCount"
    >
      タスクを削除
    </button>
    <button
      class="btn btn-secondary me-3"
      @click="$emit('deselectAllTasks')"
      :disabled="!selectedTasksCount"
    >
      選択されたタスクをクリア
    </button>

    <select
      id="tasksPerPage"
      class="form-select form-select-sm"
      :value="tasksPerPage"
      @change="
        $emit(
          'update:tasksPerPage',
          Number(($event.target as HTMLSelectElement).value)
        )
      "
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
</template>

<script setup lang="ts">
defineProps<{
  selectedTasksCount: number;
  tasksPerPage: number;
  taskDisplayOptions: number[];
}>();

defineEmits<{
  removeSelectedTasks: [];
  deselectAllTasks: [];
  "update:tasksPerPage": [value: number];
}>();
</script>

<style scoped>
@import "@/assets/css/form-select-style.css";
</style>
