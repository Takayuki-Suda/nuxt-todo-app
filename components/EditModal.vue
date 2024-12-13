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
          <input
            :value="currentEditTask"
            @input="$emit('update:currentEditTask', $event.target.value)"
            type="text"
            class="form-control"
            placeholder="タスクを編集してください"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('closeEditModal')">
            キャンセル
          </button>
          <button class="btn btn-primary" @click="$emit('saveEditTask')">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  isEditModalVisible: {
    type: Boolean,
    required: true,
  },
  currentEditTask: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['closeEditModal', 'saveEditTask', 'update:currentEditTask']);
</script>
