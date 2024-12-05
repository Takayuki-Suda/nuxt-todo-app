<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <div class="input-group mb-3">
          <input
            v-model="newTask"
            type="text"
            class="form-control"
            placeholder="Enter a new task"
            @keyup.enter="addTask"
          />
          <button class="btn btn-primary" @click="addTask">Add Task</button>
        </div>
        <div class="list-group">
          <TodoList :tasks="tasks" @toggle="toggleTask" @remove="removeTask" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import TodoList from "@/components/TodoList.vue";

const tasks = ref([]);
const newTask = ref("");

onMounted(() => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
});

const addTask = () => {
  if (newTask.value.trim() !== "") {
    tasks.value.push({ text: newTask.value, completed: false });
    newTask.value = "";
    saveTasks();
  }
};

const toggleTask = (index: number) => {
  tasks.value[index].completed = !tasks.value[index].completed;
  saveTasks();
};

const removeTask = (index: number) => {
  tasks.value.splice(index, 1);
  saveTasks();
};

const saveTasks = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("tasks", JSON.stringify(tasks.value));
  }
};

watch(tasks, saveTasks, { deep: true });
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
</style>
