<template>
  <div
    v-if="isEditModalVisible"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background: rgba(0, 0, 0, 0.5)"
    role="dialog"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">タスクを編集</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('closeEditModal')"
          ></button>
        </div>
        <div class="modal-body">
          <!-- タスク名 -->
          <input
            v-model="currentEditTask.text"
            type="text"
            class="form-control"
            placeholder="タスクを編集してください"
          />
          <!-- 締め切り日 -->
          <input
            v-model="currentEditTask.dueDate"
            type="date"
            class="form-control mt-2"
          />
          <!-- 詳細情報 -->
          <textarea
            v-model="currentEditTask.details"
            class="form-control mt-2"
            placeholder="タスクの詳細を入力してください"
            rows="4"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('closeEditModal')">
            キャンセル
          </button>
          <button class="btn btn-primary" @click="$emit('saveEditTask')">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  isEditModalVisible: {
    type: Boolean,
    required: true,
  },
  currentEditTask: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "closeEditModal",
  "saveEditTask",
  "update:currentEditTaskText",
  "update:currentEditTaskDate",
  "update:currentEditTaskDetails", // 新しく追加されたイベント
]);
</script>
