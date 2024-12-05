<template>
  <div class="container">
    <div class="add-task">
      <input
        v-model="newTask"
        placeholder="Enter a new task"
        @keyup.enter="addTask"
      />
      <button @click="addTask">Add</button>
    </div>
    <TodoList :tasks="tasks" @toggle="toggleTask" @remove="removeTask" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import TodoList from "@/components/TodoList.vue";

// タスクのリスト（初期化）
const tasks = ref([]);
const newTask = ref("");

// クライアントサイドでのみ localStorage を利用
onMounted(() => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
});

// タスクを追加
const addTask = () => {
  if (newTask.value.trim() !== "") {
    tasks.value.push({ text: newTask.value, completed: false });
    newTask.value = "";
    saveTasks();
  }
};

// タスクの完了状態をトグル
const toggleTask = (index: number) => {
  tasks.value[index].completed = !tasks.value[index].completed;
  saveTasks();
};

// タスクを削除
const removeTask = (index: number) => {
  tasks.value.splice(index, 1);
  saveTasks();
};

// タスクをローカルストレージに保存
const saveTasks = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("tasks", JSON.stringify(tasks.value));
  }
};

// ローカルストレージの変更を監視して同期
watch(tasks, saveTasks, { deep: true });
</script>

<style scoped>
.container {
  margin-top: 20px;
}
.add-task {
  margin-bottom: 20px;
}
input {
  padding: 10px;
  width: calc(100% - 80px);
  margin-right: 10px;
}
button {
  padding: 10px;
}
</style>
