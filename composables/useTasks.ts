// useTasks.ts
import { ref, computed, watch, onMounted } from "vue";

export function useTasks() {
  const tasks = ref<{ text: string; completed: boolean }[]>([]);
  const newTask = ref("");
  const showToast = ref(false);
  const toastType = ref("bg-success");
  const toastMessage = ref("タスクが正常に追加されました！");
  const selectedTasks = ref<number[]>([]);

  // 編集モーダル用の状態
  const isEditModalVisible = ref(false);
  const currentEditTaskIndex = ref<number | null>(null);
  const currentEditTask = ref("");

  // ページネーション用の状態
  const currentPage = ref(1);
  const tasksPerPage = ref(5); // デフォルトは5件表示
  const taskDisplayOptions = [5, 10, 20]; // ユーザーが選択できるタスク件数

  // ドラッグ＆ドロップ用の状態
  const draggedTaskIndex = ref<number | null>(null);
  const draggingTaskIndex = ref<number | null>(null); // 現在ドラッグ中のタスクインデックスを保持
  const dragDirection = ref<"up" | "down" | "">(""); // ドラッグ方向を保持

  // ページネーション計算
  const totalPages = computed(() => {
    const validTasks = tasks.value.filter(task => task !== null);
    return Math.max(1, Math.ceil(validTasks.length / tasksPerPage.value));
  });

  const paginatedTasks = computed(() => {
    // タスクが空の場合は空配列を返す
    if (!tasks.value || tasks.value.length === 0) {
      return [];
    }

    // 有効なタスクのみをフィルタリング
    const validTasks = tasks.value.filter(task => task !== null);

    // ページネーションの計算
    const start = (currentPage.value - 1) * tasksPerPage.value;
    const end = start + tasksPerPage.value;

    // デバッグ用のログ
    console.log('Pagination:', {
      start,
      end,
      tasksPerPage: tasksPerPage.value,
      totalTasks: validTasks.length,
      currentPage: currentPage.value,
      validTasks
    });

    // フィルタリングしたタスクをスライス
    return validTasks.slice(start, end);
  });

  // ローカルストレージからタスクを読み込む
  onMounted(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      tasks.value = JSON.parse(savedTasks);
    } else {
      tasks.value = []; // ローカルストレージにタスクがない場合、空の配列をセット
    }
  });

  // 新しいタスクを追加
  const addTask = () => {
    try {
      const trimmedTask = newTask.value.trim();
      if (!trimmedTask) {
        return;
      }
      
      if (tasks.value.some((task) => task?.text === trimmedTask)) {
        showToastMessage("タスクが重複しています！", "bg-warning");
        return;
      }
      
      tasks.value.push({ text: trimmedTask, completed: false });
      newTask.value = "";
      saveTasks();
      showToastMessage("タスクが正常に追加されました！", "bg-success");
    } catch (error) {
      console.error('タスク追加エラー:', error);
      showToastMessage("タスクの追加に失敗しました", "bg-danger");
    }
  };

  // ページ切り替え
  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  // 選択したタスクを削除
  const removeSelectedTasks = () => {
    // 選択されたインデックスをページネーションを考慮して実際のインデックスに変換
    const actualIndexes = selectedTasks.value.map(selectedIndex => {
      // 現在のページの開始インデックスを計算
      const pageOffset = (currentPage.value - 1) * tasksPerPage.value;
      // 実際のインデックスを計算（ページフセットを加算）
      return pageOffset + (selectedIndex % tasksPerPage.value);
    });

    // インデックスを降順にソートして、大きい方から削除
    const sortedIndexes = [...actualIndexes].sort((a, b) => b - a);
    
    // 大きいインデックスから順に削除
    for (const index of sortedIndexes) {
      if (index >= 0 && index < tasks.value.length) {
        tasks.value.splice(index, 1);
      }
    }

    selectedTasks.value = [];
    
    // タスク削除後にページ数を再計算
    const newTotalPages = Math.ceil(tasks.value.length / tasksPerPage.value);
    if (currentPage.value > newTotalPages) {
      currentPage.value = Math.max(1, newTotalPages);
    }
    
    saveTasks();
    showToastMessage("タスクが削除されました！", "bg-danger");
  };

  // 編集モーダルを開く
  const openEditModal = (index: number) => {
    // 現在のページのオフセットを計算
    const pageOffset = (currentPage.value - 1) * tasksPerPage.value;
    // 実際のインデックスを計算（ページオフセットを加算）
    const actualIndex = pageOffset + (index % tasksPerPage.value);
    
    if (actualIndex >= 0 && actualIndex < tasks.value.length) {
      currentEditTaskIndex.value = actualIndex;
      currentEditTask.value = tasks.value[actualIndex].text;
      isEditModalVisible.value = true;
    }
  };

  // 編集モーダルを閉じる
  const closeEditModal = () => {
    isEditModalVisible.value = false;
    currentEditTaskIndex.value = null;
  };

  // 編集したタスクを保存
  const saveEditTask = () => {
    if (currentEditTaskIndex.value !== null) {
      tasks.value[currentEditTaskIndex.value].text = currentEditTask.value;
      saveTasks();
      showToastMessage("タスクが更新されました！", "bg-info");
      closeEditModal();
    }
  };

  // トーストメセージを表示
  const showToastMessage = (message: string, type: string) => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
    }, 2000);
  };

  // タスクをローカルストレージに保存
  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks.value));
  };

  // タスクの変更を監視して保存
  watch(tasks, saveTasks, { deep: true });

  // 選択したタスクを一括で非選択
  const deselectAllTasks = () => {
    selectedTasks.value = [];
  };

  // 入力内容をクリア
  const clearInput = () => {
    newTask.value = "";
  };

  // タスク表示件数変更時のみ選択状態をリセット
  const resetPage = () => {
    currentPage.value = 1;
    selectedTasks.value = [];
    console.log('Reset page:', {
      tasksPerPage: tasksPerPage.value,
      totalTasks: tasks.value.length
    });
  };

  // ドラッグ開始時の処理
  const onDragStart = (index: number) => {
    // 現在のページを考慮したインデックス
    const fullIndex = index + (currentPage.value - 1) * tasksPerPage.value;
    draggedTaskIndex.value = fullIndex;
    draggingTaskIndex.value = fullIndex;
  };

  // ドラッグオーバー時の処理
  const onDragOver = (index: number) => {
    const fullIndex = index + (currentPage.value - 1) * tasksPerPage.value;

    if (draggedTaskIndex.value !== null) {
      dragDirection.value = fullIndex < draggedTaskIndex.value ? "up" : "down";
      draggingTaskIndex.value = fullIndex; // ページ体でのインデックス
    }
  };

  // ドロップ時の処理
  const onDrop = (index: number) => {
    if (draggedTaskIndex.value !== null && draggingTaskIndex.value !== null) {
      const draggedTask = tasks.value[draggedTaskIndex.value];
      const targetIndex = index + (currentPage.value - 1) * tasksPerPage.value;

      // 現在のタスクを移動
      tasks.value.splice(draggedTaskIndex.value, 1);
      tasks.value.splice(targetIndex, 0, draggedTask);

      saveTasks();
    }
    // ドロップ後のリセット
    draggedTaskIndex.value = null;
    draggingTaskIndex.value = null;
    dragDirection.value = "";
  };

  // 上方向にドラッグしているかを判定
  const isDraggingUp = (index: number) => {
    const fullIndex = index + (currentPage.value - 1) * tasksPerPage.value;
    return (
      dragDirection.value === "up" && draggingTaskIndex.value === fullIndex
    );
  };

  // 下方向にドラッグしているかを判定
  const isDraggingDown = (index: number) => {
    const fullIndex = index + (currentPage.value - 1) * tasksPerPage.value;
    return (
      dragDirection.value === "down" && draggingTaskIndex.value === fullIndex
    );
  };

  // TaskListコンポーネントで使用するgetActualIndex
  const getActualIndex = (index: number) => {
    const pageOffset = (currentPage.value - 1) * tasksPerPage.value;
    const validTasks = tasks.value.filter(task => task !== null);
    return validTasks.findIndex(task => 
      task === tasks.value[index + pageOffset]
    );
  };

  // 外部から使用するために返す
  return {
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
    getActualIndex,
  };
}
