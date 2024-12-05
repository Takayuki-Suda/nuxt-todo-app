<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <div class="input-group mb-3">
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
            class="btn btn-danger ms-3"
            @click="removeSelectedTasks"
            :disabled="!selectedTasks.length"
          >
            タスクを削除
          </button>
        </div>
        <div class="list-group">
          <div
            v-for="(task, index) in tasks"
            :key="index"
            class="list-group-item d-flex align-items-center justify-content-between"
          >
            <div>
              <input
                type="checkbox"
                class="form-check-input me-3"
                :value="index"
                v-model="selectedTasks"
              />
              <span :class="{ 'text-decoration-line-through': task.completed }">
                {{ task.text }}
              </span>
            </div>
            <button
              class="btn btn-secondary btn-sm"
              @click="openEditModal(index)"
            >
              編集
            </button>
          </div>
        </div>
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
    <div
      v-if="showToast"
      class="position-fixed top-0 end-0 p-3"
      style="z-index: 1050; width: 300px; transition: opacity 0.5s ease-out"
    >
      <div
        class="toast show"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        :class="toastType"
      >
        <div class="toast-header">
          <strong class="me-auto">{{ toastMessage }}</strong>
          <button
            type="button"
            class="btn-close"
            @click="showToast = false"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";

const tasks = ref<{ text: string; completed: boolean }[]>([]);
const newTask = ref("");
const showToast = ref(false);
const toastType = ref("bg-success");
const toastMessage = ref("タスクが正常に追加されました！");
const selectedTasks = ref<number[]>([]); // 選択されたタスクのインデックスを管理

// 編集モーダル用の状態
const isEditModalVisible = ref(false);
const currentEditTaskIndex = ref<number | null>(null);
const currentEditTask = ref("");

// ローカルストレージからタスクを読み込む
onMounted(() => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
});

// 新しいタスクを追加
const addTask = () => {
  const trimmedTask = newTask.value.trim();
  if (trimmedTask === "") {
    return;
  }
  if (tasks.value.some((task) => task.text === trimmedTask)) {
    // 重複タスクが存在する場合
    showToastMessage("タスクが重複しています！", "bg-warning");
  } else {
    tasks.value.push({ text: trimmedTask, completed: false });
    newTask.value = "";
    saveTasks();
    showToastMessage("タスクが正常に追加されました！", "bg-success");
  }
};

// 選択したタスクを削除
const removeSelectedTasks = () => {
  tasks.value = tasks.value.filter(
    (_, index) => !selectedTasks.value.includes(index)
  );
  selectedTasks.value = []; // 削除後に選択をクリア
  saveTasks();
  showToastMessage("タスクが削除されました！", "bg-danger");
};

// 編集モーダルを開く
const openEditModal = (index: number) => {
  currentEditTaskIndex.value = index;
  currentEditTask.value = tasks.value[index].text;
  isEditModalVisible.value = true;
};

// 編集モーダルを閉じる
const closeEditModal = () => {
  isEditModalVisible.value = false;
  currentEditTaskIndex.value = null;
  currentEditTask.value = "";
};

// 編集を保存
const saveEditTask = () => {
  if (currentEditTaskIndex.value !== null) {
    const trimmedTask = currentEditTask.value.trim();
    if (trimmedTask === "") {
      showToastMessage("タスクは空にできません！", "bg-warning");
      return;
    }
    tasks.value[currentEditTaskIndex.value].text = trimmedTask;
    saveTasks();
    showToastMessage("タスクが更新されました！", "bg-success");
    closeEditModal();
  }
};

// トーストメッセージを表示
const showToastMessage = (message: string, type: string) => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  // 2秒後にトーストを非表示
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

// タスクをローカルストレージに保存
const saveTasks = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("tasks", JSON.stringify(tasks.value));
  }
};

// タスクの変更を監視して保存
watch(tasks, saveTasks, { deep: true });
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

/* トーストのカスタマイズ */
.toast {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toast-header {
  background-color: #007bff;
  color: white;
}

.modal {
  display: block;
}

.modal-content {
  border-radius: 10px;
}
</style>
