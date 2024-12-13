<template>
  <div class="row">
    <div class="col-12">
      <!-- 入力エリア -->
      <div class="input-container border p-3 mb-3">
        <div class="input-group">
          <input
            v-model="newTask"
            type="text"
            class="form-control"
            placeholder="新しいタスクを入力"
            @keyup.enter="addTask"
          />
          <button class="btn btn-primary ms-3" @click="addTask">
            タスクを追加
          </button>
          <button
            class="btn btn-secondary ms-3"
            @click="clearInput"
            :disabled="!newTask"
          >
            入力内容をクリア
          </button>
        </div>
      </div>

      <!-- ボタンとタスクリストを一つの枠で囲む -->
      <div class="task-container border p-3">
        <!-- タスク管理ボタン -->
        <div class="mb-3 d-flex align-items-center">
          <button
            class="btn btn-danger me-3"
            @click="removeSelectedTasks"
            :disabled="!selectedTasks.length"
          >
            タスクを削除
          </button>
          <button
            class="btn btn-secondary me-3"
            @click="deselectAllTasks"
            :disabled="!selectedTasks.length"
          >
            選択されたタスクをクリア
          </button>

          <!-- ここにセレクトボックスを配置 -->
          <select
            id="tasksPerPage"
            class="form-select form-select-sm"
            v-model="tasksPerPage"
            @change="resetPage"
          >
            <option
              v-for="option in taskDisplayOptions"
              :key="option"
              :value="option"
            >
              {{ option }} 件
            </option>
          </select>
        </div>

        <!-- タスクリスト -->
        <div class="list-group">
          <div
            v-for="(task, index) in paginatedTasks"
            :key="task.text"
            class="list-group-item d-flex align-items-center justify-content-between position-relative"
            draggable="true"
            :class="{
              dragging:
                draggedTaskIndex === index + (currentPage - 1) * tasksPerPage,
              'dragging-up':
                draggingTaskIndex ===
                  index + (currentPage - 1) * tasksPerPage &&
                dragDirection === 'up',
              'dragging-down':
                draggingTaskIndex ===
                  index + (currentPage - 1) * tasksPerPage &&
                dragDirection === 'down',
            }"
            @dragstart="onDragStart(index)"
            @dragover.prevent="onDragOver(index)"
            @drop="onDrop(index)"
          >
            <div>
              <input
                type="checkbox"
                class="form-check-input me-3"
                :value="index + (currentPage - 1) * tasksPerPage"
                v-model="selectedTasks"
              />
              <span :class="{ 'text-decoration-line-through': task.completed }">
                {{ task.text }}
              </span>
            </div>
            <button
              class="btn btn-secondary btn-sm"
              @click="openEditModal(index + (currentPage - 1) * tasksPerPage)"
            >
              編集
            </button>
          </div>
        </div>
      </div>

      <!-- ページネーション -->
      <nav aria-label="Task pagination" class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">
              前へ
            </button>
          </li>
          <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          <li
            :class="{ disabled: currentPage === totalPages }"
            class="page-item"
          >
            <button class="page-link" @click="changePage(currentPage + 1)">
              次へ
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- 編集モーダル -->
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
            @click="closeEditModal"
          ></button>
        </div>
        <div class="modal-body">
          <input
            v-model="currentEditTask"
            type="text"
            class="form-control"
            placeholder="タスクを編集してください"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEditModal">
            キャンセル
          </button>
          <button class="btn btn-primary" @click="saveEditTask">保存</button>
        </div>
      </div>
    </div>
  </div>

  <!-- トースト通知 -->
  <ToastNotification
  :showToast="showToast"
  :toastType="toastType"
  :toastMessage="toastMessage"
  @close="showToast = false"
/>

</template>

<script setup lang="ts">
import { useTasks } from "../composables/useTasks";
import ToastNotification from './ToastNotification.vue';

const {
  tasks,
  newTask,
  showToast,
  toastType,
  toastMessage,
  selectedTasks,
  isEditModalVisible,
  currentEditTaskIndex,
  currentEditTask,
  currentPage,
  tasksPerPage,
  taskDisplayOptions,
  draggedTaskIndex,
  draggingTaskIndex,
  dragDirection,
  totalPages,
  paginatedTasks,
  addTask,
  changePage,
  removeSelectedTasks,
  openEditModal,
  closeEditModal,
  saveEditTask,
  showToastMessage,
  saveTasks,
  deselectAllTasks,
  clearInput,
  resetPage,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingUp,
  isDraggingDown,
} = useTasks();
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.task-container {
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-container {
  border: 2px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.dragging {
  background-color: rgba(0, 123, 255, 0.2); /* 青い枠 */
  border: 2px solid #007bff; /* 青い枠の強調 */
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5); /* 青い枠の影 */
}

.dragging-up::before,
.dragging-down::after {
  content: "";
  display: block;
  position: absolute;
  height: 3px;
  background-color: red; /* 赤い線 */
  left: 0;
  right: 0;
  z-index: 1;
}

.dragging-up::before {
  top: 0; /* 上に赤い線 */
}

.dragging-down::after {
  bottom: 0; /* 下に赤い線 */
}

.form-select {
  width: 100px;
}
</style>
