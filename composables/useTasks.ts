// useTasks.ts
import { onMounted } from 'vue';
import { useTaskState } from './task/useTaskState';
import { useTaskPagination } from './task/useTaskPagination';
import { useTaskDragDrop } from './task/useTaskDragDrop';
import { useTaskOperations } from './task/useTaskOperations';
import { useTaskEdit } from './task/useTaskEdit';
import { useTaskNotification } from './task/useTaskNotification';

export function useTasks() {
  const state = useTaskState();
  const notification = useTaskNotification();
  const pagination = useTaskPagination(
    state.tasks,
    state.currentPage,
    state.tasksPerPage,
    state.selectedTasks
  );
  
  const operations = useTaskOperations(
    state.tasks,
    state.newTask,
    state.selectedTasks,
    state.currentPage,
    state.tasksPerPage,
    notification.showToastMessage
  );
  
  const dragDrop = useTaskDragDrop(
    state.tasks,
    state.currentPage,
    state.tasksPerPage,
    operations.saveTasks
  );
  
  const edit = useTaskEdit(
    state.tasks,
    state.currentPage,
    state.tasksPerPage,
    state.isEditModalVisible,
    state.currentEditTaskIndex,
    state.currentEditTask,
    notification.showToastMessage,
    operations.saveTasks
  );

  onMounted(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      state.tasks.value = JSON.parse(savedTasks);
    }
  });

  return {
    ...state,
    ...notification,
    ...pagination,
    ...operations,
    ...dragDrop,
    ...edit,
  };
}
