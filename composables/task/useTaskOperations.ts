import { watch } from 'vue';
import type { Ref } from 'vue';

export function useTaskOperations(
  tasks: Ref<{ text: string; completed: boolean }[]>,
  newTask: Ref<string>,
  selectedTasks: Ref<number[]>,
  currentPage: Ref<number>,
  tasksPerPage: Ref<number>,
  showToastMessage: (message: string, type: string) => void
) {
  const addTask = () => {
    try {
      const trimmedTask = newTask.value.trim();
      if (!trimmedTask) return;
      
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

  const removeSelectedTasks = () => {
    const actualIndexes = selectedTasks.value.map(selectedIndex => {
      const pageOffset = (currentPage.value - 1) * tasksPerPage.value;
      return pageOffset + (selectedIndex % tasksPerPage.value);
    });

    const sortedIndexes = [...actualIndexes].sort((a, b) => b - a);
    
    for (const index of sortedIndexes) {
      if (index >= 0 && index < tasks.value.length) {
        tasks.value.splice(index, 1);
      }
    }

    selectedTasks.value = [];
    saveTasks();
    showToastMessage("タスクが削除されました！", "bg-danger");
  };

  const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks.value));
  };

  watch(tasks, saveTasks, { deep: true });

  const clearInput = () => {
    newTask.value = "";
  };

  const deselectAllTasks = () => {
    selectedTasks.value = [];
  };

  return {
    addTask,
    removeSelectedTasks,
    saveTasks,
    clearInput,
    deselectAllTasks,
  };
} 