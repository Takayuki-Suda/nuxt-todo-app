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
            @input="onDueDateChange"
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

// propsの受け取り
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

// formattedDueDateをlocal stateで管理
const formattedDueDate = ref("");

// currentEditTask.dueDateが変更されたときにformattedDueDateを更新
watch(
  () => props.currentEditTask.dueDate,
  (newDueDate) => {
    // dueDateがISO形式の場合、ローカルタイムゾーンでYYYY-MM-DD形式に変換して表示
    if (newDueDate) {
      const date = new Date(newDueDate);
      // ローカルタイムゾーンで表示
      formattedDueDate.value = date.toLocaleDateString("en-CA"); // YYYY-MM-DD形式
    }
  },
  { immediate: true }
);

// formattedDueDateが変更された場合、currentEditTask.dueDateを更新
const onDueDateChange = () => {
  // 日付が変更されたとき、currentEditTask.dueDateに反映させる
  const date = new Date(formattedDueDate.value);
  props.currentEditTask.dueDate = date.toISOString(); // ISO 8601形式で保存
};

// 保存ボタンがクリックされた時に親コンポーネントに変更を通知
const saveEditTask = () => {
  emit("saveEditTask"); // 親コンポーネントに保存イベントを通知
};
</script>
