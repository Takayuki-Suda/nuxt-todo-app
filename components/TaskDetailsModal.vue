<template>
  <div
    v-if="task"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background: rgba(0, 0, 0, 0.5)"
    role="dialog"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">タスク詳細</h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <p><strong>タスク:</strong> {{ task.text }}</p>
          <p><strong>期限:</strong> {{ task.dueDate }}</p>
          <p><strong>完了:</strong> {{ task.completed ? "完了" : "未完了" }}</p>
          <p><strong>詳細:</strong> {{ task.details }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "~/types/task";

const props = defineProps<{
  task: Task | null;
}>();
</script>

<style scoped>
.modal {
  display: block;
}
</style>
