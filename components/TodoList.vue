<template>
  <ul class="todo-list">
    <li
      v-for="(task, index) in tasks"
      :key="index"
      :class="{ completed: task.completed }"
    >
      <input
        type="checkbox"
        :checked="task.completed"
        @change="$emit('toggle', index)"
      />
      <span>{{ task.text }}</span>
      <button @click="$emit('remove', index)">Remove</button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
// タスクのリストを受け取る
defineProps<{
  tasks: { text: string; completed: boolean }[];
}>();
</script>

<style scoped>
.todo-list {
  list-style-type: none;
  padding: 0;
}
.todo-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.todo-list li.completed span {
  text-decoration: line-through;
}
button {
  margin-left: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
