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
            v-model="formattedDueDate"
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
          <button class="btn btn-primary" @click="saveEditTask">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

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

const emit = defineEmits(["closeEditModal", "saveEditTask"]);

// formattedDueDateは実際のdueDateをYYYY-MM-DD形式で保持する
const formattedDueDate = ref("");

watch(
  () => props.currentEditTask.dueDate,
  (newDueDate) => {
    // dueDateがISO 8601形式の場合、YYYY-MM-DD形式に変換
    if (newDueDate) {
      const date = new Date(newDueDate);
      formattedDueDate.value = date.toISOString().split("T")[0]; // YYYY-MM-DD形式
    }
  },
  { immediate: true }
);

const saveEditTask = () => {
  // formattedDueDateをcurrentEditTask.dueDateに反映
  props.currentEditTask.dueDate = formattedDueDate.value;
  emit("saveEditTask");
};
</script>
