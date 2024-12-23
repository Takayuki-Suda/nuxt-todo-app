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
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <p><strong>タスク名:</strong> {{ task.text }}</p>
          <p><strong>完了:</strong> {{ task.completed ? "はい" : "いいえ" }}</p>
          <p><strong>締切:</strong> {{ formatDueDate(task.dueDate) }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">
            閉じる
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { Task } from "~/types/task";

const props = defineProps<{
  task: Task | null;
}>();

const formatDueDate = (dueDate: string) => {
  const date = new Date(dueDate);
  return date.toLocaleDateString(); // 日付をフォーマット
};
</script>

<style scoped>
.modal {
  display: block;
}
</style>
