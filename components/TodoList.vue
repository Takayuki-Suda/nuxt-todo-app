<template>
  <div class="list-group">
    <div
      v-for="(task, index) in tasks"
      :key="index"
      class="list-group-item d-flex justify-content-between align-items-center"
      :class="{ 'list-group-item-success': task.completed }"
    >
      <span @click="toggleTask(index)" style="cursor: pointer">
        <input type="checkbox" v-model="task.completed" />
        {{ task.text }}
      </span>
      <button class="btn btn-danger btn-sm" @click="removeTask(index)">
        Remove
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  tasks: Array,
});

const emit = defineEmits(["toggle", "remove"]);

const toggleTask = (index: number) => {
  emit("toggle", index); // タスクの完了状態を親コンポーネントに通知
};

const removeTask = (index: number) => {
  emit("remove", index); // タスクの削除を親コンポーネントに通知
};
</script>

<style scoped>
.list-group-item {
  transition: background-color 0.3s;
}

.list-group-item-success {
  background-color: #d4edda;
}
</style>
