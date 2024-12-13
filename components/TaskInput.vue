<template>
  <div class="input-container border p-3 mb-3">
    <div class="input-group">
      <input
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        type="text"
        class="form-control"
        placeholder="新しいタスクを入力"
        @keyup.enter="handleAddTask"
      />
      <button class="btn btn-primary ms-3" @click="handleAddTask">
        タスクを追加
      </button>
      <button
        class="btn btn-secondary ms-3"
        @click="$emit('clearInput')"
        :disabled="!modelValue"
      >
        入力内容をクリア
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  addTask: [];
  clearInput: [];
}>();

const handleAddTask = () => {
  if (props.modelValue.trim()) {
    emit("addTask");
  }
};
</script>

<style scoped>
@import "@/assets/css/input-container-style.css";
</style>
