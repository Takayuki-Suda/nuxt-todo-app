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
          <p><strong>詳細:</strong> {{ task.details || "なし" }}</p>
          <p><strong>完了:</strong> {{ task.completed ? "はい" : "いいえ" }}</p>
          <p><strong>締切:</strong> {{ formatDueDate(task.dueDate) }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-warning" @click="$emit('edit', task)">
            編集
          </button>
          <button class="btn btn-danger" @click="$emit('delete', task.id)">
            削除
          </button>
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
import { formatDueDate } from "~/utils/dateUtils"; // インポート

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
