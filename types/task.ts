export interface Task {
  text: string;
  completed: boolean;
}

export interface TaskState {
  tasks: Task[];
  newTask: string;
  selectedTasks: number[];
  isEditModalVisible: boolean;
  currentEditTaskIndex: number | null;
  currentEditTask: string;
  currentPage: number;
  tasksPerPage: number;
} 