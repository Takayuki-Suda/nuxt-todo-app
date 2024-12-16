export interface Task {
  text: string;
  completed: boolean;
  dueDate: string;
}

export interface TaskState {
  tasks: Task[];
  currentEditTask: Task | null;
  currentEditTaskIndex: number | null;
  isEditModalVisible: boolean;
  currentPage: number;
  tasksPerPage: number;
  newTask: string;
  selectedTasks: number[];
}
